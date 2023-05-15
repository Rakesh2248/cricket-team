const express = require("express");
const path = require("path");
const {open} = require.sqlite;
const sqlite3 = require.sqlite3;
const dbPath = path.join(__dirname,cricketTeam.db);
const app = express();
app.use(express.json());
let db = null;

const initializerDBAndServer = async ()=>{
    try{
        db = await open({
            filename : dbPath,
            driver : sqlite3.Database
        });
        app.listen(3000,()=>{
            console.log("Server running at http://localhost:3000");
        });
    }
    catch(error){
        console.log(`DB Error: ${error.message}`);
    }
}
initializerDBAndServer();

const convertDBObjectToResponseObject = (dbObject)=>{
    return{
        playerId: dbObject.player_id,
        playerName: dbObject.player_name,
        jerseyNumber: dbObject.jersey_number,
        role: dbObject.role
    };
};

app.get("/players/",async (request,response)=>{
    const getPlayerQuery = `
        SELECT * FROM cricket_team;`;
    const playerArray = await db.all(getPlayerQuery);
    response.send(playerArray.map((eachPlayer)=>{
        convertDBObjectToResponseObject(eachPlayer)
        )
    });
});

app.get("/players/:playerId/",async (request,response)=>{
    const {playerId} = request.params;
    const getPlayerQuery = `
        SELECT  * FROM cricket_team WHERE player_Id = ${playerId}`;
    const player = await db.run(getPlayerQuery);
    response.send(convertDBObjectToResponseObject(player));
})

app.post("/players/",async (request,response)=>{
    const {playerName,jerseyNumber,role} = request.body;
    const postPlayerQuery = `
        INSERT INTO cricket_team 
        (player_name,jersey_number,role) 
        VALUES (`${playerName}`,${jerseyNumber},${role});`;
    const player = await db.run(postPlayerQuery);
    response.send("Player Added to Team");    
});

app.put("/players/:playerId/",async (request,response)=>{
    const {playerName,jerseyNumber,role} = request.body;
    const {playerId} = request.params;
    const putPlayerQuery = `
        UPDATE cricket_team 
        SET
        player_name = ${playerName},
        jersey_number = ${jerseyNumber},
        role = ${role}
        WHERE playerId = ${playerId}`;
    await.db.run(putPlayerQuery);
    response.send("Player Details Updated");
});
app.delete("/players/:playerId/",async (request,response)=>{
    const {playerId} = request.params;
    const deletePlayerQuery = `
        DELETE cricket_team WHERE player_id = ${playerId};`;
    await.db.run(deletePlayerQuery);
    response.send("Player Removed");
});

module.exports = app;