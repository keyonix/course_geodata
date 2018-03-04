//1. ОБЪЕКТ Image И ДАННЫЕ LANDSAT
var aoi = /* color: #d63000 */ee.Geometry.Polygon(
      [[[37.613539695739746, 55.748153987915465],
        [37.61645793914795, 55.74902352618936],
        [37.62315273284912, 55.74989304508292],
        [37.621307373046875, 55.752622242389236],
        [37.61645793914795, 55.75513390126626],
        [37.61469841003418, 55.75230827365778],
        [37.61250972747803, 55.749071833303]]]);
// Загрузим снимок Landsat 8
var image = ee.Image('LANDSAT/LC08/C01/T1_TOA/LC08_179021_20180110');

// Определим параметры визуализации в режиме false colour
var vizParameters = {
  bands: ['B5','B4','B3'],
  min: 0,
  max: 0.5,
  gamma: [0.95,1.1,1]
};
// Обрежем изображение по области интереса
var image_clipped = image.clip(aoi);
// Добавим снимок на карту с визуализацией  false colour
Map.addLayer(image,vizParameters,'Image false color');
// Добавим обрезанный снимок на карту с визуализацией  false colour
Map.addLayer(image_clipped,vizParameters,'Image false color clipped');
// Можно центрировать карту по точным координатам
//Map.setCenter(36.519, 55.918,5);
// Центрируем карту по обрезанному снимку
Map.centerObject(image_clipped, 15);
//Вводим переменную, в которую записываем 3 спектральных канала из общего снимка
var image_3channels = image.select(['B5','B4','B3']);
//Экспортируем снимок с 3 канлами в пределах контура  области интереса
Export.image.toDrive({
  image:image_3channels,
  description: 'imageToDrive',
  scale: 30,
  region: aoi
});


//2. ОБЪЕКТ ImageCollection И ДАННЫЕ SENTINEL-2
var bounds = /* color: #0b4a8b */ee.Geometry.Polygon(
      [[[37.231163862205676, 56.235846923754],
        [37.2367202471944, 55.85701808068951],
        [37.524626386844716, 55.86012612945767],
        [37.52191851427449, 56.04178715725434],
        [37.513565177835744, 56.23584779827502]]]);
//Вводим переменные
var bands = ['B1','B2', 'B3', 'B4', 'B5', 'B6', 'B7', 'B8', 'B8A', 'B10', 'B11', 'B12']
var start = ee.Date('2017-06-01');
var finish = ee.Date('2017-08-30');
//Загружаем коллекцию снимков Sentinel-2
var img = ee.ImageCollection('COPERNICUS/S2')
  .filterBounds(bounds) // Фильтруем по области интереса
  .filterDate(start,finish) // Фильтруем по датам
  .filter(ee.Filter.lt('CLOUD_COVERAGE_ASSESSMENT',10)); // Фильтруем по облачности
  
//Понижаем коллекцию снимков до одного снимка с помощью сортировки по метаданным (облачность)
var image = ee.Image(img.sort('CLOUD_COVERAGE_ASSESSMENT') 
  .first()) // выбираем первый снимок в ранжированном ряду
  .clip(bounds) // обрезаем снимок по области интереса
  .select(bands); // выбираем каналы для работы
// Задаем параметры визуализации в режиме True colour
var visParams = {bands: ['B4', 'B3', 'B2'], gamma: 2, min:300, max:5000};
// Центрируем карту по области интереса
Map.centerObject(bounds, 9);
// Добавляем коллекцию снимков на карту
Map.addLayer(img,visParams,'Image Collection');
// Добавляем отфильтрованный снимок на карту
Map.addLayer(image,visParams,'Image');


//3. РАСЧЕТ ИНДЕКСА NDVI
//Опция 1. Расчет нормированной разности двух каналов для единичного снимка
var ndvi=image.normalizedDifference(['B8A', 'B4']);
// Определяем параметры визуализации для расчнтного слоя NDVI
var vis = {min: 0, max: 2, palette: [
'FFFFFF', 'CE7E45', 'FCD163', '66A000', '207401',
'056201', '004C00', '023B01', '012E01', '011301']};
// Добавляем слой на карту
Map.addLayer(ndvi, vis, 'NDVI image');

//Опция 2. Расчет нормированной разности двух каналов серии снимков
//Определим функцию addNDVI
function addNDVI(image) {
  var ndvi = image.normalizedDifference(['B8A', 'B4']);
  return image.addBands(ndvi);
}
// Добавим дополнительный канал nd к существующим спектральным каналам в коллекции снимков
// с помощью вызова функции addNDVI
var with_ndvi = img.map(addNDVI);
// Определяем параметры визуализации для коллекции снимков, с помощью визуализации нового канала nd
var vis_collection = {bands: ['nd'], min: 0, max: 2, palette: [
  'FFFFFF', 'CE7E45', 'FCD163', '66A000', '207401',
  '056201', '004C00', '023B01', '012E01', '011301']};
// Добавляем слой на карту
Map.addLayer(with_ndvi,vis_collection,'Images+NDVI');
