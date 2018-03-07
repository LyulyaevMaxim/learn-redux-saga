import test from "tape";
import { put, call } from "redux-saga/effects";
import { delay } from "redux-saga";
import { incrementAsync } from "./sagas";

test("incrementAsync test", assert => {
  const gen = incrementAsync();
  /*
  incrementAsync - это функция генератора, при запуске возвращаяющая объект-итератор
  а метод итератора next вернёт объект формата { done: boolean, value: any }
  done: генератор завершился или ниже есть ещё выражения yeild
  value: результат выражения, возвращаемого выражением справа от yeild
  */

  /* 
  yield delay(1000)
  yield put({type: 'INCREMENT'})
  =>
    gen.next() // => { done: false, value: <результат вызова delay(1000)> }
    gen.next() // => { done: false, value: <результат вызова put({type: 'INCREMENT'})> }
    gen.next() // => { done: true, value: undefined }
      undefined - так как в incrementAsync мы не использовали return
  */

  /*
   чтобы протестировать логику внутри incrementAsync придётся просто перебирать возвращаемый функцией генератор и проверять значения, полученные генератором

   но как проверить delay(1000)? 
   функция задержки возвращает Promise, который мы не можем проверить на ===
   чтобы задержка возвращала Objects Effects (JS объекты, оформленные определённым способом) 
   обернём её в call: yield call(delay(1000)) 
        put({type: 'INCREMENT'})    // => { PUT: {type: 'INCREMENT'} }
        call(delay, 1000)           // => { CALL: {fn: delay, args: [1000]}}
   
    middleware тип каждого эффекта, полученного yield.
        если тип PUT  -> диспатчит action в Store   (Effect creation)
        если тип СALL -> вызовет данную функцию     (Effect execution)

  */

  // чтобы проверить логику incrementAsync,
  // мы просто перебираем генератор и делаем deepEqual тесты по его значениям.
  assert.deepEqual(
    gen.next().value,
    call(delay, 1000),
    "incrementAsync Saga must call delay(1000)"
  );

  assert.deepEqual(
    gen.next().value,
    put({ type: "INCREMENT" }),
    "incrementAsync Saga must dispatch an INCREMENT action"
  );

  assert.deepEqual(
    gen.next(),
    { done: true, value: undefined },
    "incrementAsync Saga must be done"
  );

  assert.end();
});
