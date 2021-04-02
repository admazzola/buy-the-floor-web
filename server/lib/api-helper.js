 
    import Web3Helper from './web3-helper.js'
    import BidPacketUtils from '../../src/js/bidpacket-utils.js'
    
    import FileHelper from './file-helper.js'
    
 
    export default class APIHelper  {
    
        constructor(   ){
           
           
        }

        //http://localhost:3000/api/v1/somestuff
        static async handleApiRequest(request, mongoInterface){
            console.log('got api request', request.params )

            if(request.params['query'].toLowerCase() == 'overview' ){


                return await APIHelper.getOverview(mongoInterface)
            }

            return 'This is the API'
        }

        static async getOverview(mongoInterface){



            return {success:true}
        }
    
         
    }