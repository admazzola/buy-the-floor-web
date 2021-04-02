 
    import Web3Helper from './web3-helper.js'
    import BidPacketUtils from '../../src/js/bidpacket-utils.js'

    import web3utils from 'web3-utils'
    
    import FileHelper from './file-helper.js'
 
    
    let envmode = process.env.NODE_ENV

    let wolfpackConfigFile = FileHelper.readJSONFile('./server/dataghostconfig.json')
    let wolfpackConfig = wolfpackConfigFile[envmode].wolfPackConfig

 
    export default class APIHelper  {
    
        constructor(   ){
           
           
        }

        //http://localhost:3000/api/v1/somestuff
        static async handleApiRequest(request, mongoInterface, wolfpackInterface){
            console.log('got api request', request.params )

            if(request.params['query'].toLowerCase() == 'overview' ){


                return await APIHelper.getOverview(mongoInterface,wolfpackInterface)
            }

            return 'This is the API'
        }

        static async getOverview(mongoInterface,wolfpackInterface){

            let networkData = await mongoInterface.findOne('network_data')



            let response = {success:true, tokens:[], network: networkData}

            for(let token of wolfpackConfig.contracts ){  
                let address = web3utils.toChecksumAddress( token.address ) 

                console.log('address',address)

                
                let tokenData = await wolfpackInterface.getMongo().findOne('contract_state',{contractAddress: address })

                console.log('tokenData',tokenData)
                response.tokens.push(tokenData)
            }

            return response
        }

        
        static async getDataForToken(tokenAddress, wolfpackInterface ){

            tokenAddress = web3utils.toChecksumAddress(tokenAddress)

            let tokenData = await wolfpackInterface.getMongo().findOne('contract_state',{contractAddress: tokenAddress })

            return tokenData
        }

        static async getUserBalanceApprovalForToken(userAddress, tokenAddress, spenderAddress, wolfpackInterface ){

            contractAddress = web3utils.toChecksumAddress(contractAddress)
            userAddress = web3utils.toChecksumAddress(userAddress)
            spenderAddress = web3utils.toChecksumAddress(spenderAddress)

            let balanceData = await wolfpackInterface.getMongo().findOne('erc20_balances',{contractAddress: tokenAddress, accountAddress: userAddress })
            let approvedData = await wolfpackInterface.getMongo().findOne('erc20_approvals',{contractAddress: tokenAddress, ownerAddress: userAddress , spenderAddress:  spenderAddress })

            return { balance: balanceData.amount, approved: approvedData.amount }
        }
    
         
    }