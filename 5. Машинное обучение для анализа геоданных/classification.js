// Область интреса, в пределах которой необходимо произвести классификацию ландшафта
var Bounds = /* color: #00ffff */ee.Geometry.Polygon(
        [[[96.48193359375, 72.65958846878621],
          [96.13037109375, 71.30079291637452],
          [98.41809151958319, 71.28725578372836],
          [100.87646484375, 71.27259471233448],
          [101.14013671875, 72.67268149675316]]])
// Объединяем две созданных от руки FeatureCollection 'land' и 'lake' в одну коллекцию
var polygons=lake.merge(land);
// Проверим отображение набора данных для обучения на карте
Map.addLayer(polygons,{}, 'Dataset for training')
// Проверим свойства и количество объектов в объединенной FeatureCollection  через консоль
print(polygons);

// Add NDVI band to Image Collection
// Определите функцию, которая добавляет канал NDVI к набору снимков

// Задайте начало и конец временного промежутка для поиска снимков
// Загрузите коллекцию снимков COPERNICUS
// Добавьте канал NDVI с помощью команды .map к коллекции снимков
// Отфильтруйте снимки по временному промежутку
// Отфильтруйте снимки по облачности
//'Понизьте' коллекцию снимков до единичного изображения, с помощью фильтрации по области интересса, 
// сортировкой снимков по облачности, и выбором снимка с минимальным значением облачности
// Задайте параметры визуализации для отфильтрованного изображения в режиме натуральных цветов  
// Добавьте слой с изображением на карту с центрированием по объекту

// Classification with ML
// Классификация изображения с помощью алгоритмов машинного обучения

// Use these bands for prediction.
// Определяем каналы, на которых будем обучаться
var bands = ['B1','B2','B3', 'B4', 'B5', 'B6', 'B7', 'B8', 'B8A', 'B9','B10', 'B11', 'B12', 'NDVI'] //COPERNICUS 

// Select image bands
// Выбираем каналы изображения, на которых будем обучаться
var image = image.select(bands);

// Load training polygons from a Feature Collection.
// The 'class' property stores known class labels.
// Определяем полигоны, по которым будет производиться обучение для каждого класса
var polygons = polygons;

// Get the values for all pixels in each polygon in the training.
// Извлекаем образцы пиеселей классов из снимка, который будем классифицировать в соответсвии 
// с определенным набором полигонов для обучения
var training = image.sampleRegions({
  // Get the sample from the polygons FeatureCollection.
  collection: polygons,
  // Keep this list of properties from the polygons.
  properties: ['class'],
  // Set the scale to get Landsat pixels in the polygons.
  scale: 30
});

// Create an RF classifier with custom parameters
// Создаем классификатор Random Forest и определяем количество деревьев
var classifier = ee.Classifier.randomForest({
    numberOfTrees: 30,
});

// Train the classifier
// Обучаем классификатор Random Forest
var trained = classifier.train(training, 'class', bands);

// Classify the image.
// Классифицируем изображение
var classified = image.classify(trained);

// Create a palette to display the classes
// Задаем контрастные параметры визуализации
var palette = [
  '#8d5524', // water
  '00aedb'  // tundra
];

// Добавьте классифицированный растр на карту с заданными параметрами визуализации, обрезав его по области интереса.
