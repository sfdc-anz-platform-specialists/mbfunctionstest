public with sharing class FunctionApex {
    public static void test() {
        System.debug('Invoking myfunction');

        functions.Function myFunction = functions.Function.get('MyFunctionsProject.myfunction');
        functions.FunctionInvocation invocation = myFunction.invoke('{"name":"MyAccount"}');
        String jsonResponse = invocation.getResponse();

        System.debug('Response from myfunction ' + jsonResponse);
    }
}
