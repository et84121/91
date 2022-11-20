91 DI and Decorator Class
===

## 善用重構工具

- `nicoespeon.abracadabra` VSCode Pluging for JS/TS Refactoring
  - [Repo](https://github.com/nicoespeon/abracadabra/blob/main/REFACTORINGS.md)
  - [VSCode market](https://marketplace.visualstudio.com/items?itemName=nicoespeon.abracadabra)
- VSCode Native TypeScript Refactoring Method
  - <https://code.visualstudio.com/docs/typescript/typescript-refactoring>

## 肥大的 Class 怎麼拆

- 針對主要的 method 往下拆成 private method
  - [extract-method](https://code.visualstudio.com/docs/editor/refactoring#_extract-method)
- 將相似的 method 分類拆成獨立 class
  - [extract-class](https://github.com/nicoespeon/abracadabra/blob/main/REFACTORINGS.md#extract-class)
- 將獨立 class 分別移動至獨立檔案
  - [move to new file](https://code.visualstudio.com/docs/typescript/typescript-refactoring#:~:text=a%20type%20alias.-,Move%20to%20new%20file,-%2D%20Move%20one%20or)
- [DI] 將新獨立出來的 class 建立 Interface
  - [extract-interface](https://github.com/nicoespeon/abracadabra/blob/main/REFACTORINGS.md#extract-interface)
- [DI] 將新獨立出來的 class 統一由 Constructor 注入
  - [parameter-properties](https://www.typescriptlang.org/docs/handbook/2/classes.html#parameter-properties)
- [Decorator] 從分拆的主要 function 前後開始觀察是否有可以拆成以裝飾器實作的動作
  - 那些不需要與主要任務有需要直接耦合的任務
    - `auth.isVaild()` 裡的 notify
    - `auth.isVaild()` 驗證動作裡的帳號是否鎖定的前置檢查

## Decorator

- <https://refactoring.guru/design-patterns/decorator/typescript/example>
- 在要做事的 function 前 (參數) / 後 (回傳值) 動手腳
- 但 Interface 還是相同
- 在今天課程例子裡，auth flow 裡送 slack 通知並不是主要 feature
  - 因此可以使用裝飾器模式，在 `isVaild()` return false 時，送 Slack 通知即可
- [TypeScript 5.0 預計實作 ECMAScript Decorators 提案](https://github.com/microsoft/TypeScript/issues/51362)
  - ECMAScript Decorators 終於進入 Stage 3.0 了
  - [過時舊資訊] [是否应该在production里使用typescript的decorator?](https://www.zhihu.com/question/404724504)

### Cons

- Decorator Order is Matter; 順序很重要
- 可能 Unit-Test 都過，但整合起來就是有問題
- 靠 Code Review 避免
- 或只拆成一個 Decorator 就沒順序問題了
- 依賴整合測試

### 寫法一

- with `class` keyword
- 類別實際上是一種特別的函數([functions](https://developer.mozilla.org/zh-TW/docs/Web/JavaScript/Reference/Functions))
- <https://developer.mozilla.org/zh-TW/docs/Web/JavaScript/Reference/Classes>
- 有著傳統 OO 特徵，心智負擔小
- 難以處理非同步建構任務
- Bundler 難以 chunk 分拆 function
- 這樣還是要實作全部的方法，累 🥲

```typescript
class XXXDecorator implements IClass{
    constructor(service:IService,instance:IClass){
        this._service = service;
        this._instance = instance;
        // ....   
    }

    operation(..args:any[]){
        // 在參數動手腳 (Before)
        const result = this._instance.operation(...args)
        // 在回傳動手腳 (After)
    }

    // 還要繼續實作其它 method
    ...otherMethod(..args)
}
```

### 寫法二

- closure based OO
- `Hook` in React
- `Composable` function in Vue.js
- <https://developer.mozilla.org/zh-TW/docs/Web/JavaScript/Closures>
- 方便處理 async 初始化動作
- 這樣寫比較能偷懶，只需處理要修飾的 method

```typescript
function XXXDecorator(service:IService,instance:IClass):IClass{
    const decoratorFn =  (...args)=>{
        // 在參數動手腳 (Before)
        const result = instance.operation(...args)
        // 在回傳動手腳 (After)
    }
    
    return {
        ...instance,
        operation: decoratorFn
    }
}
```

### 寫法三

- 使用 JavaScript (預計實作)原生的 Decorators 語法
- [TC39 ECMAScript Decorators 提案](https://github.com/tc39/proposal-decorators) 終於進入 Stage 3.0 了
- [TypeScript 5.0 預計實作 ECMAScript Decorators 提案](https://github.com/microsoft/TypeScript/issues/51362)
  - [過時資訊] [是否应该在生產環境裡使用 TypeScript 的 Decorator?](https://www.zhihu.com/question/404724504)

### 其它補充

- 舉例：
  - CacheDecorator -> 裝飾 Service 層 (API 層)
    - 裝飾器就可以決定要從 Cache 拿還是真打 API

- In Functional Programing, maybe it could be replaced by function compsition.

## JS DI Framework

![](https://i.imgur.com/xSIiMRv.png)

- <https://inversify.io/>
- <https://github.com/microsoft/tsyringe>
- <https://github.com/nicojs/typed-inject>
