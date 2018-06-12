import java.io.BufferedReader;
import java.io.FileReader;
import java.io.FileWriter;
import java.io.IOException;
import java.util.ArrayList;

public class CSVReader {

    public static void main(String[] args) {
    	FileWriter writer;
		try {
		writer = new FileWriter("C:\\Users\\pglj2\\Desktop\\teste\\attacks2.txt");
        String csvFile = "C:\\Users\\pglj2\\Desktop\\teste\\attacks.txt";
        String line = "";
        String cvsSplitBy = ",";
        int temp = 0;
        int contgeral=0;
        int contN=0, contY=0;
        try (BufferedReader br = new BufferedReader(new FileReader(csvFile))) {
        	
            while ((line = br.readLine()) != null) {
                String[] linha = line.split(cvsSplitBy);
                ArrayList a = new ArrayList<String>();
                if(linha.length > 12 && temp < 6235 && 
                		(!linha[1].equals("")) && 
                		(!linha[1].contains("Reported ")) && 
                		(!linha[2].equals("")) && 
                		(!linha[4].equals("")) && 
                		(!linha[7].equals("")) && 
                		(!linha[9].equals("")) && 
                		(!linha[12].equals("")) ) {
                writer.append(linha[1]);
                writer.append(',');
                
                writer.append(linha[2]);
                writer.append(',');
                
                writer.append(linha[3]);
                writer.append(',');
                
                writer.append(linha[4]);
                writer.append(',');
                
                writer.append(linha[5]);
                writer.append(',');
                
                writer.append(linha[6]);
                writer.append(',');
                
                writer.append(linha[7]);
                writer.append(',');
                
                writer.append(linha[9]);
                writer.append(',');
               
                writer.append(linha[10]);
                writer.append(',');
                
                writer.append(linha[12]);
                if(linha[12].equals("Y")) {
                	contY++ ;
                } else {
                	contN++ ;
                } 
                
                ;
                writer.append('\n');
                contgeral++;
                
                }
                
                temp++;
            }
            System.out.println("contN "+contN);
            System.out.println("contY "+contY);
            System.out.println("contgeral "+ contgeral);
        } catch (IOException e) {
            e.printStackTrace();
        }
        writer.flush();
        writer.close();
		} catch (IOException e1) {
			// TODO Auto-generated catch block
			e1.printStackTrace();
		}
    }  
}