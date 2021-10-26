#Mikes script to set up the MyFunctionsScratchOrg

#delete scrtatch org
sfdx force:org:delete -u MBFunctionsScratchOrg

#create scratch org
sfdx shane:org:create --userprefix functionuser -o mbfunctions.demo -s -d 30 -a MBFunctionsScratchOrg

#... and set the password
sfdx shane:user:password:set -p sfdx1234 -g User -l User

#push the source
sfdx force:source:push

#assign permsets
sfdx force:user:permset:assign -n Functions


#8. open the org
sfdx force:org:open

sf env create compute -o MBFunctionsScratchOrg -a MBFunctionsComputeEnv

sf deploy functions -o MBFunctionsScratchOrg









