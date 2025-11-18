package com.limonnana.service;

import java.io.FileWriter;
import java.io.IOException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class UtilsService {

    private String absolutePath = "/home/eyal/WebDevelopment/DataBaseBAK/dataBase.txt";

    public void writerToFile(String line) {
        try (FileWriter writer = new FileWriter(absolutePath, true)) {
            // true = append mode
            writer.write(line + "\n");
        } catch (IOException e) {
            e.printStackTrace();
        }
    }
}
