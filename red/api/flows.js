/**
 * Copyright 2014, 2015 IBM Corp.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 **/
var express = require('express');
var fs = require("fs");
var events = require("../events");
var path = require("path");

var log = require("../log");
var redNodes = require("../nodes");
var settings = require("../settings");
var deviceServer = require("../deviceServer");
var localDev = require("../localDev");

module.exports = {
    get: function(req,res) {
        res.json(redNodes.getFlows());
    },
    post: function(req,res) {
        
        // By MCF
        var deployDev = req.body.pop().TargetDev;
        console.log("targetDevice="+deployDev+"; localDevice="+localDev);
        if (deployDev == localDev) {
            var flows = req.body;
            redNodes.setFlows(flows).then(function() {
                res.json(204);
            }).otherwise(function(err) {
                util.log("[red] Error saving flows : "+err);
                res.send(500,err.message);
            });
        } else {
            deviceServer.deploy(deployDev, req.body);
            res.json(204);
        }

        /*var flows = req.body;
        redNodes.setFlows(flows).then(function() {
//=======
//        var flows = req.body;
//        var deploymentType = req.get("Node-RED-Deployment-Type")||"full";
//        redNodes.setFlows(flows,deploymentType).then(function() {
//>>>>>>> 5efc89d514c3a16ebf25715a3b1f3c5326dbec99
            res.send(204);
        }).otherwise(function(err) {
            log.warn("Error saving flows : "+err.message);
            log.warn(err.stack);
            res.send(500,err.message);
        });*/
    }
}
