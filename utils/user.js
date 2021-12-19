
const users = []

//join user to chat

function getJoinUser(id,username,room){
    const user = {id,username,room}
    users.push(user)
    return user
}

//get curent user

function getCurrentUser(id){
   return users.find(user=> user.id === id)
}

// leave room
function userLeave(id){
    const index = users.findIndex(user => user.id  === id);
    
    if(index !== -1){
        return(users.splice(index,1)[0])    
    }  
}

// Get users in room  
function getRoomUsers(room){
    return users.filter(user => user.room === room)
}
module.exports= {
    getJoinUser,getCurrentUser,userLeave,getRoomUsers
}
 
