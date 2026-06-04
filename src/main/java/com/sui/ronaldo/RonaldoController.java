package com.sui.ronaldo;

import com.anthropic.models.messages.Model;
import com.anthropic.client.okhttp.AnthropicOkHttpClient;
import com.anthropic.models.messages.Message;
import com.anthropic.models.messages.MessageCreateParams;
import com.sui.ronaldo.dto.ChatRequest;
import com.sui.ronaldo.dto.ChatResponse;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
@CrossOrigin(origins = "http://localhost:5173")
@RestController
public class RonaldoController {

    @Value("${anthropic.api.key}")
    private String API_KEY;

    private final Map<String, List<String>> conversations = new HashMap<>();

    @PostMapping("/chat")
    public ChatResponse chat(@RequestBody ChatRequest prompt) {

        String conversationId = prompt.getConversationID();

        conversations.putIfAbsent(conversationId, new ArrayList<>());

        List<String> history = conversations.get(conversationId);

        history.add("User: " + prompt.getMessage());

        String fullConversation = String.join("\n", history);

        var client = AnthropicOkHttpClient.builder()
                .apiKey(API_KEY)
                .build();

        var params = MessageCreateParams.builder()
                .model(Model.CLAUDE_OPUS_4_8)
                .maxTokens(1000)
                .addUserMessage(
                        "You are a supportive self-help and motivation coach. " +
                                "Your goal is to help the user build discipline, confidence, consistency, emotional control, and a stronger mindset. " +
                                "You can use Cristiano Ronaldo as an example or source of inspiration when relevant, especially for topics like hard work, focus, resilience, training mentality, confidence, and handling pressure. " +
                                "However, do not pretend to be Cristiano Ronaldo, and do not make every answer about him. " +
                                "Keep the main focus on the user's personal growth and practical next steps.\n\n" +

                                "Use the conversation history to understand follow-up messages. " +
                                "For example, if the user says 'make it shorter', 'rewrite it', 'explain that', or 'make it more motivating', " +
                                "use the previous messages and replies to understand what they mean.\n\n" +

                                "Here is the conversation so far:\n" +
                                fullConversation +

                                "\n\nLatest user message:\n" +
                                prompt.getMessage() +

                                "\n\nReply in a calm, encouraging, practical way."
                )
                .build();

        Message message = client.messages().create(params);

        String aiReply = message.content().get(0).asText().text();

        history.add("Assistant: " + aiReply);

        return new ChatResponse(aiReply, conversationId);
    }

    @PostMapping("/reset")
    public String resetChat(@RequestBody ChatRequest prompt) {
        conversations.remove(prompt.getConversationID());
        return "Conversation reset.";
    }
}