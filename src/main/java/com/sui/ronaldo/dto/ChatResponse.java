package com.sui.ronaldo.dto;

public class ChatResponse {
    private String reply;
    private String conversationId;
   public ChatResponse(String reply, String conversationId){
        this.reply = reply;
        this.conversationId = conversationId;
    }
    public String getReply(){
       return reply;
    }
    public String getConversationId(){
       return conversationId;
    }
}
