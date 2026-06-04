package com.sui.ronaldo.dto;

public class ChatRequest {
    private String message;
    private String conversationID;
    public ChatRequest(){

    }
    public String getMessage(){
        return message;
    }
    public String getConversationID(){
        return conversationID;
    }
    public void setMessage(String message){
        this.message = message;
    }
    public void setConversationID(String conversationID)
{
        this.conversationID = conversationID;
    }
}