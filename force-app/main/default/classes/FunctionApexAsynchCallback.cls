public with sharing class FunctionApexAsynchCallback implements functions.FunctionCallback {
    

    public void handleResponse(functions.FunctionInvocation result) {
        // Handle result of function invocation
        String jsonResponse = result.getResponse();
        System.debug('Got response ' + jsonResponse);
        
        //JSONParser parser = JSON.createParser(jsonResponse);
        // Process JSON using your own data class...
      }

}