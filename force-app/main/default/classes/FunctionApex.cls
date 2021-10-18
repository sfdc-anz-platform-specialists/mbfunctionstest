public with sharing class FunctionApex {
    public static void test() {
        System.debug('Now Invoking Mikes myfunction');

        functions.Function myFunction = functions.Function.get('MyFunctionsProject.myfunction');
        functions.FunctionInvocation invocation = myFunction.invoke('{"name":"MyAccount","accountNumber":"6666","type":"Customer - Direct"}');
        String jsonResponse = invocation.getResponse();

        System.debug('Response from Mikes myfunction ' + jsonResponse);

    }

    public static void test2() {
        System.debug('Now Invoking Mikes myfunction');

        functions.Function anotherFunction = functions.Function.get('MyFunctionsProject.anotherfunction');
        functions.FunctionInvocation invocation = anotherFunction.invoke('{"name":"MyAccount","accountNumber":"6666","type":"Customer - Direct"}');
        String jsonResponse = invocation.getResponse();

        System.debug('Response from Mikes myfunction ' + jsonResponse);

    }
}