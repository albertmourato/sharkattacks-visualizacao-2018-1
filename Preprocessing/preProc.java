import java.io.BufferedReader;
import java.io.FileReader;
import java.io.FileWriter;
import java.io.IOException;
import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.Date;

public class preProc {

    public static void main(String[] args) {
    	FileWriter writer;
    	FileWriter writerCountry;
		try {
		//writer = new FileWriter("C:\\Users\\pglj2\\Desktop\\teste\\attacks2.txt");
		writer = new FileWriter("C:\\Users\\MidiaVox - Paulo\\Desktop\\sharkattacks-visualizacao-2018-1\\Preprocessing\\attacks2.txt");
		writerCountry = new FileWriter("C:\\Users\\MidiaVox - Paulo\\Desktop\\sharkattacks-visualizacao-2018-1\\Preprocessing\\Country.js");
        //String csvFile = "C:\\Users\\pglj2\\Desktop\\teste\\attacks.txt";
        String csvFile = "C:\\Users\\MidiaVox - Paulo\\Desktop\\sharkattacks-visualizacao-2018-1\\Preprocessing\\attacks.txt";
        String line = "";
        String cvsSplitBy = ",";
        int temp = 0;
        int contgeral=0;
        int contN=0, contY=0;
        ArrayList a = new ArrayList<String>();
        ArrayList b = new ArrayList<Integer>();
        try (BufferedReader br = new BufferedReader(new FileReader(csvFile))) {
        	
            while ((line = br.readLine()) != null) {
                String[] linha = line.split(cvsSplitBy);
                
                if(linha.length > 12 && temp < 6235 && 
                		(!linha[1].equals("")) && 
                		(!linha[1].contains("Reported ")) /*&&
                		(
                		(linha[1].contains("Jan")) ||
                		(linha[1].contains("Feb")) ||
                		(linha[1].contains("Mar")) ||
                		(linha[1].contains("Apr")) ||
                		(linha[1].contains("May")) ||
                		(linha[1].contains("Jun")) ||
                		(linha[1].contains("Jul")) ||
                		(linha[1].contains("Aug")) ||
                		(linha[1].contains("Sep")) ||
                		(linha[1].contains("Oct")) ||
                		(linha[1].contains("Nov")) ||
                		(linha[1].contains("Dec"))
                		) */&&
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
                
                if(!a.contains(linha[4])) { 
                	a.add(linha[4]);
                	b.add(1);
                }
                else {
                	int ind = a.indexOf(linha[4]);
                	int k = (int)b.get(a.indexOf(linha[4]));
                	b.set(ind, k + 1);
         	
                }
                
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
            int cont = 0;
            writerCountry.append("var countries = [");
            for (int i = 0; i < a.size(); i++) {
                String value = (String) a.get(i);
                int valorInt = (int) b.get(i);
                if(value.contains("ST HELENA")) value = "ST HELENA";
                if(!value.contains("Unprovoked") && !value.contains("Provoked") && !value.contains("34") && !value.contains("Country") && !value.equals("N") && !value.contains("?")) {
                writerCountry.append("{Country:\""+value+"\",");
                writerCountry.append("Value:\""+ valorInt );
                if(i == a.size() - 1)
                	writerCountry.append("\"}");
                else writerCountry.append("\"},");
                System.out.println("Country: " + value + " Value: "+ valorInt);
                cont += valorInt;
                }
            }
            writerCountry.append("]");
            System.out.println("Quantidade total paises: "+ cont);
            
            
        } catch (IOException e) {
            e.printStackTrace();
        }
        writer.flush();
        writer.close();
        writerCountry.flush();
        writerCountry.close();
		} catch (IOException e1) {
			// TODO Auto-generated catch block
			e1.printStackTrace();
		}
    }
    
}