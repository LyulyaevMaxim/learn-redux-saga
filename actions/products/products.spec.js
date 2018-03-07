import test from "tape";
import { put, call } from "redux-saga/effects";
import { fetchProducts } from "./products";

/*
 в fetchProducts мы запрашиваем данные с сервера, но... тестировать это не практично
 поэтому заменим функции фейковой, не запускающей запрос данных,
 а лишь проверяющей, вызван ли fetch с правильными аргументами
 (правильный url, передаваемые параметры)

 Mocks делает тестирование более сложным и менее надежным. 
 Но функции, просто возвращающие значения, легче тестировать
 ведь мы можем использовать простой equal() для проверки результата. 
 => это способ написать самые надежные тесты.

 equal(), по сути, отвечает на два наиболее важных вопроса, 
 на которые должен отвечать каждый модульный (unit) тест:
 * каков фактический результат?
 * каков ожидаемый результат?
*/

/* вместо вызова асинхронной функции изнутри генератора, 
   можем дать только описание вызова функции: просто выведем объект, подобный:
      {
        CALL: {
          fn: Api.fetch,
          args: ['./products']
        }
      }

    Таким образом, при тестировании генератора, нам нужно лишь проверить, что он дает ожидаемую команду, выполнив простой deepEqual на yielded object

    По этой причине библиотека предоставляет другой способ выполнения асинхронных вызовов:
          yield fetch("api.com/products")   =>  yield call(fetch, "/products") */
function* fetchProducts() {
  const products = yield call(fetch, "/products");
}

test("fetchProducts test", assert => {
  const iterator = fetchProducts();

  assert.deepEqual(
    iterator.next().value,
    call(Api.fetch, "/products"),
    "fetchProducts should yield an Effect call(Api.fetch, './products')"
  );
  /* преимущество подобных декларативных вызовов в том, что можем протестировать всю логику
     внутри саги просто проитерировав до конца весь генератор 
     и последовательно проведя deepEqual на получаемые значения 
     это позволяет подробно протестировать логику асинхронных операций независимо от сложности 

     call поддерживает вызов метода объекта  (аналогично можно вызывать "cps")
        yield call([obj, method], arg1, arg2)
      
      можно воспользоваться алиасом (apply):
        yield apply(obj, method, [arg1, arg2])

      "call" и "apply" хорошо подходят для функций, возвращающих Promise results

      "cps" - для обработки функций NodeJs, описываемых в стиле func(...args, callback),
      где callback = (error, result) => ()
        например, считаем файл
          import { cps } from 'redux-saga/effects'
          const content = yield cps(readFile, '/path/to/file')

        и протестируем
          const iterator = fetchSaga()
          assert.deepEqual( 
            iterator.next().value, 
            cps(readFile, '/path/to/file') 
          ) */

  // create fake response
  const products = {};

  //-----------  проверим на наличе соответствующего dispatch -----------
  assert.deepEqual(
    iterator.next(products).value,
    put({ type: "PRODUCTS_RECEIVED", products }),
    "fetchProducts should yield an Effect put({ type: 'PRODUCTS_RECEIVED', products })"
  );
  /* с помощью метода next мы передали генератору поддельный ответ
     за пределами middleware, мы имеем полный контроль над генератором 
     и можем имитировать реальную среду simply mocking results and resuming the Generator with them

     mocking данные - намного проще, чем mocking функции и spying calls
  */

  //----------- проверим, диспатчится ли FAILED, когда сервер возвращает ошибку -----------
  // create a fake error
  const error = {};

  // проверим на наличие соответствующего dispatch
  assert.deepEqual(
    // в этом случае мы передали фиктивную ошибку в метод throw.
    // это заставит генератор выйти из try и выполнить catch
    iterator.throw(error).value,
    put({ type: "PRODUCTS_REQUEST_FAILED", error }),
    "fetchProducts should yield an Effect put({ type: 'PRODUCTS_REQUEST_FAILED', error })"
  );

  assert.end();
});
