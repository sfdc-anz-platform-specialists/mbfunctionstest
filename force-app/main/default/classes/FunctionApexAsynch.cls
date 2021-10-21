public with sharing class FunctionApexAsynch {

    public static void test() {
        System.debug('Now Invoking Mikes myfunction');

        //functions.Function myFunction = functions.Function.get('MyFunctionsProject.myfunction');
        //functions.FunctionInvocation invocation = myFunction.invoke('{"name":"MyAccount","accountNumber":"6666","type":"Customer - Direct"}');
       
        functions.Function myFunction = functions.Function.get('MyFunctionsProject.myfunction');
        functions.FunctionInvocation invocation = myFunction.invoke( '{ "latitude": "36.169090","longitude": "-115.140579","length": 5}', new FunctionApexAsynchCallback());
       

    }


}