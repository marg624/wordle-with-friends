package com.db;

import com.google.gson.Gson;
import com.sun.net.httpserver.HttpExchange;
import com.sun.net.httpserver.HttpHandler;
import com.sun.net.httpserver.HttpServer;

import java.io.BufferedReader;
import java.io.IOException;
import java.io.InputStreamReader;
import java.io.OutputStream;
import java.net.InetSocketAddress;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.concurrent.Executors;

public class Main {
    public static Map<String, Data> db = new HashMap<>();

    public static void main(String[] args) throws IOException {
        Data dummy = new Data("player0", "player1", "words", new ArrayList<>());
        db.put("123", dummy);

        HttpServer server = HttpServer.create(new InetSocketAddress(8080), 0);
        System.out.println("Server started on http://localhost:8080");
        server.createContext("/get", new GetHandler(db));
        server.createContext("/update", new PutHandler(db));
        server.createContext("/create", new CreateHandler(db));
        server.setExecutor(Executors.newFixedThreadPool(2));
        server.start();
    }
}

class GetHandler implements HttpHandler {
    public Map<String, Data> _db;
    public GetHandler(Map<String, Data> db) {
        _db = db;
    }

    public void handle(HttpExchange exchange) throws IOException {
        System.out.println("GET:");
        String path = exchange.getRequestURI().getQuery();
        String gameId = path.replaceAll("gameId=","");
        System.out.println(gameId);
        Data data = _db.get(gameId);

        int code = 200;
        String json = "";
        if (data == null) {
            code = 404;
            System.out.println("Not found: " + gameId);
        } else {
            Gson gson = new Gson();
            json = gson.toJson(data);
            System.out.println(json);
        }
        exchange.sendResponseHeaders(code, json.length());
        OutputStream os = exchange.getResponseBody();
        os.write(json.getBytes());
        os.close();
    }
}

class CreateHandler implements HttpHandler {
    public Map<String, Data> _db;
    public CreateHandler(Map<String, Data> db) {
        _db = db;
    }

    public void handle(HttpExchange exchange) throws IOException {
        System.out.println("CREATE:");

        String path = exchange.getRequestURI().getQuery();
        String gameId = path.replaceAll("gameId=","");
        System.out.println(gameId);

        InputStreamReader isr = new InputStreamReader(exchange.getRequestBody(), "utf-8");
        BufferedReader br = new BufferedReader(isr);
        String json = br.readLine();
        System.out.println("   Request: " + json);
        Gson gson = new Gson();
        Data data = gson.fromJson(json, Data.class);

        String response = "";
        int code = 200;
        if(_db.containsKey(gameId)) {
            code = 400;
            System.out.println("Already exists: " + gameId);
        } else {
            _db.put(gameId, data);
            System.out.println(json);
        }

        exchange.sendResponseHeaders(code, response.length());
        OutputStream os = exchange.getResponseBody();
        os.write(response.getBytes());
        os.close();
    }
}

class PutHandler implements HttpHandler {
    public Map<String, Data> _db;
    public PutHandler(Map<String, Data> db) {
        _db = db;
    }

    public void handle(HttpExchange exchange) throws IOException {
        System.out.println("UPDATE:");

        String path = exchange.getRequestURI().getQuery();
        String gameId = path.replaceAll("gameId=","");
        System.out.println(gameId);

        InputStreamReader isr = new InputStreamReader(exchange.getRequestBody(), "utf-8");
        BufferedReader br = new BufferedReader(isr);
        String json = br.readLine();
        System.out.println("   Request: " + json);
        Gson gson = new Gson();
        DataUpdate dataUpdated = gson.fromJson(json, DataUpdate.class);
        Data dataOriginal = _db.get(gameId);

        List<String> guesses = dataOriginal.getGuesses();
        String response = "";
        int code = 200;

        if (dataUpdated.getGuess() == null && dataUpdated.getPlayer()!= null && dataOriginal.getPlayer1()==null) {
            dataOriginal.setPlayer1(dataUpdated.getPlayer());
        } else if (dataOriginal.getNextPlayer().equals(dataUpdated.getPlayer()) && dataOriginal.getPlayer1() != null && dataOriginal.getPlayer0()!= null) {
            guesses.add(dataUpdated.getGuess());
            dataOriginal.setGuesses(guesses);
        } else {
            response = "Invalid update";
            code = 400;
            System.out.println("Not your turn or 2 players havent joined yet");
        }
        exchange.sendResponseHeaders(code, response.length());
        OutputStream os = exchange.getResponseBody();
        os.write(response.getBytes());
        os.close();
    }
}

class DataUpdate {
    private String player;
    private String guess;

    public DataUpdate(String player, String guess) {
        this.player = player;
        this.guess = guess;
    }

    public DataUpdate(String playerAdd) {
        this.player = playerAdd;
    }

    public String getPlayer() {
        return player;
    }

    public void setPlayer(String player) {
        this.player = player;
    }

    public String getGuess() {
        return guess;
    }

    public void setGuess(String guess) {
        this.guess = guess;
    }
}

class Data {
    private String player0;
    private String player1;
    private String winningWord;
    private List<String> guesses;

    public Data(String player0, String player1, String winningWord, List<String> guesses) {
        this.player0 = player0;
        this.player1 = player1;
        this.winningWord = winningWord;
        this.guesses = guesses;
    }

    public String getPlayer0() {
        return player0;
    }

    public void setPlayer0(String player0) {
        this.player0 = player0;
    }

    public String getPlayer1() {
        return player1;
    }

    public void setPlayer1(String player1) {
        this.player1 = player1;
    }

    public String getWinningWord() {
        return winningWord;
    }

    public void setWinningWord(String winningWord) {
        this.winningWord = winningWord;
    }

    public List<String> getGuesses() {
        return guesses;
    }

    public void setGuesses(List<String> guesses) {
        this.guesses = guesses;
    }

    public String getNextPlayer() {
        return ((this.guesses.size()) % 2 == 0) ? this.player0 : this.player1;
    }
}
