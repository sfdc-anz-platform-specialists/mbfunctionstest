public with sharing class FunctionApex {
    public static void test() {
        System.debug('Now Invoking Mikes myfunction');

        functions.Function myFunction = functions.Function.get('MyFunctionsProject.myfunction');
        functions.FunctionInvocation invocation = myFunction.invoke('{"name":"MyAccount","accountNumber":"6666","type":"Customer - Direct"}');
        String jsonResponse = invocation.getResponse();

        functions.Function myFunction = functions.Function.get('MyFunctionsProject.myfunction2');
        invocation = myFunction.invoke('{"name":"MyAccount2","accountNumber":"7777","type":"Customer - Direct"}');
        String jsonResponse2 = invocation.getResponse();


        System.debug('Response from Mikes myfunction ' + jsonResponse);
        System.debug('Response from Mikes myfunction ' + jsonResponse2);

    }
}