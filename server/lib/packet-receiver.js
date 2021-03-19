
 
 import express from 'express'
import fs from 'fs'

import PacketHelper from './packet-helper.js'
import { Server } from "socket.io";

import http from 'http'

export default class PacketReceiver  {

    constructor(mongoInterface){
        this.mongoInterface = mongoInterface;


        const app = express()

        var server = http.createServer(app);

        this.startSocketServer(server)
    }


    startSocketServer(server )
    {
    
    
        //THIS IS CORRECT 
      let options={
        cors: {
          origin: "*",
          methods: ["GET", "POST"],
          
        }
      }
     
    
      

      //const httpServer = createServer();
      const io = new Server(server, options);


      //var io = require('socket.io')(server, options);
      var port = process.env.PORT || 8443;  //8443
      
      var mongoInterface = this.mongoInterface
    
      ///  https://socket.io/docs/rooms-and-namespaces/#
    
    
      server.listen(port, function () {
        console.log('Socket server listening at port %d', port);
      });
    
      var sockets = {};
    
    
      io.on('connection', function (socket) {
        console.log('established new socket connection');
    
    
            socket.on('ping', function (data) {
              console.log('ping', data);
    
                io.emit('pong', {
                    message:'pong'
                  });
    
    
               });
    
    
    
      
    
    
            socket.on('bidPacket', async function (data) {
    
                 let packet = data.packet 
    
                console.log('got Websocket data', data  )
    
          


                    var bidPacket = {
                        bidderAddress:packet.bidderAddress,
                        nftContractAddress: packet.nftContractAddress,
                        currencyTokenAddress: packet.currencyTokenAddress,
                        currencyTokenAmount: packet.currencyTokenAmount,
                        expires:packet.expires,
                        signature:packet.signature
                    }
                    console.log('got Websocket packet', bidPacket  )
    
                    var result = await PacketHelper.storeNewBidPacket(packet,  mongoInterface);
     
    
                 socket.emit('lavaPacket',  {success:true });
    
                 socket.disconnect()
    
            }.bind(this));
    
    
    
     
    
             socket.on('getBidPackets', async function (data) {
    
                 var bidPackets = await PacketHelper.getBidPackets( mongoInterface)

               //get from mongo 
    
                socket.emit('bidPackets',  bidPackets);
    
              });
    
              
          
        socket.on('disconnect', function () {
          console.log(socket.sid, 'disconnected');
          delete sockets[socket.sid];
        });
      }.bind(this));
    
    
    
    }
    

}