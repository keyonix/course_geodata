// ШАБЛОН ДЛЯ РАБОТЫ С ДАННЫМИ О НАСЕЛЕНИИ
// Загружаем набор данных о населении планеты
var imageCollection = ee.ImageCollection("CIESIN/GPWv4/population-count");
// Вводим параметры визуализации
var imageVisParam2 = {bands:["population-count"],min:/*значение переменной*/,max:/*значение переменной*/,palette:["52dfff","0f17ff"]};
// Берем данные о населении за 2015 год
var filtered2015 = imageCollection.filterDate('2015');

// ШАБЛОН ДЛЯ РАБОТЫ С ВЕКТОРНЫМИ ДАННЫМИ
// Загружаем векторные данные по положению стран Мира в виде полигонов
// (https://fusiontables.google.com/data?docid=1tdSwUL7MVpOauSgRzqVTOwdfy17KDbw-1d9omPw#rows:id=1)
var countries = ee.FeatureCollection('ft:1tdSwUL7MVpOauSgRzqVTOwdfy17KDbw-1d9omPw');
// Другие векторные данные доступны по адресу
// https://developers.google.com/earth-engine/vector_datasets
// Фильтруем данные по названию страны для получения нужного полгиона
var country = countries.filter(ee.Filter.eq('Country', 'Название страны'));

// ШАБЛОН ДЛЯ СОЗДАНИЯ ССЫЛКИ ЗАГРУЗКИ ОБЪЕКТА
var path = image.getDownloadURL({
  scale: 30, //Масштаб м/пиксель
  crs: 'EPSG:4326', // Проекция
  region: '[[-120, 35], [-119, 35], [-119, 34], [-120, 34]]' //Область интереса
});
print(path);
