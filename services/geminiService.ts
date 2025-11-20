import { GoogleGenAI } from "@google/genai";
import { AiResponse, GroundingSource } from "../types";

const apiKey = process.env.API_KEY;

// Initialize client - assumes API_KEY is available in env
const ai = new GoogleGenAI({ apiKey: apiKey });

/**
 * Searches for academic papers with strict filtering for top Econ journals.
 */
export const findRelatedPapers = async (registryName: string, topic?: string): Promise<AiResponse> => {
  if (!apiKey) throw new Error("API Key missing");

  // We construct a search query that forces Google to look at specific domains
  const domainQuery = `(site:aeaweb.org OR site:nber.org OR site:cepr.org OR site:academic.oup.com/qje OR site:journals.uchicago.edu/tocs/jpe)`;
  const contextQuery = `"Danish ${registryName}" OR "Denmark ${registryName}" ${topic ? topic : ''}`;
  
  const prompt = `Find 4-5 distinct, high-quality economics research papers.
  
  SEARCH CONTEXT:
  The user wants papers that use Danish Administrative Data (specifically "${registryName}").
  Focus ONLY on:
  1. American Economic Association (AEA) journals (AER, AEJ: Applied, etc.)
  2. NBER Working Papers
  3. CEPR Discussion Papers
  4. Quarterly Journal of Economics (QJE)
  
  QUERY TO USE: ${domainQuery} ${contextQuery}

  OUTPUT FORMAT (Markdown):
  Return a clean list. For each paper:
  
  ### [Title of the Paper]
  *   **Authors**: [Author Names]
  *   **Source**: [Journal Name/Working Paper Series] ([Year])
  *   **Data Usage**: [Specific mention of how they used ${registryName} or Danish data]
  *   🔗 [Link to abstract/PDF]([URL])

  If you cannot find papers for this specific registry in these top journals, broaden the search to "Danish administrative data" generally but keep the high-quality journal constraint.
  `;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
      config: {
        tools: [{ googleSearch: {} }],
      },
    });

    const text = response.text || "No specific high-quality papers found matching these criteria.";
    const chunks = response.candidates?.[0]?.groundingMetadata?.groundingChunks || [];
    
    const sources: GroundingSource[] = chunks
      .map(chunk => {
        if (chunk.web) {
          return { title: chunk.web.title || 'Source', uri: chunk.web.uri || '#' };
        }
        return null;
      })
      .filter((s): s is GroundingSource => s !== null);

    return { text, sources };

  } catch (error) {
    console.error("Gemini API Error:", error);
    return { text: "Unable to fetch papers. Please check your API key.", sources: [] };
  }
};

/**
 * Explains a registry or specific variables.
 */
export const explainRegistryContext = async (registryCode: string, userQuery: string): Promise<AiResponse> => {
  if (!apiKey) throw new Error("API Key missing");

  const prompt = `You are an expert in Danish Statistics (DST).
  Registry: "${registryCode}"
  User Question: "${userQuery}"
  
  Provide a concise, expert answer. Use Google Search to ensure information about variable coverage is current.`;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
      config: {
        tools: [{ googleSearch: {} }],
      },
    });

    const text = response.text || "No info available.";
     const chunks = response.candidates?.[0]?.groundingMetadata?.groundingChunks || [];
    
    const sources: GroundingSource[] = chunks
      .map(chunk => {
        if (chunk.web) {
          return { title: chunk.web.title || 'Web Source', uri: chunk.web.uri || '#' };
        }
        return null;
      })
      .filter((s): s is GroundingSource => s !== null);

    return { text, sources };
  } catch (error) {
    console.error("Gemini API Error:", error);
    return { text: "Error processing request.", sources: [] };
  }
};

/**
 * Deep search for DST variables using specific site operators.
 */
export const searchVariables = async (query: string): Promise<AiResponse> => {
  if (!apiKey) throw new Error("API Key missing");

  // Construct a query that digs into the specific DST documentation sub-sites
  const searchDirectives = `site:dst.dk/da/Statistik/dokumentation/Times OR site:dst.dk/extranet/forskningvariabellister OR site:esundhed.dk`;
  
  const prompt = `Act as a Danish Statistics (DST) expert. The user is looking for variable documentation.
  
  User Query: "${query}"
  
  SEARCH STRATEGY:
  1. Use Google Search to find the variable code in the DST "Times" documentation or "Forskningvariabellister".
  2. Search Query to execute: \`${searchDirectives} "${query}"\`
  3. Look for pages that contain the variable code (e.g. AEL_KOMKOD, SOC_STATUS) in the URL or title.

  OUTPUT REQUIREMENTS:
  If you find a match, extract:
  - **Variable Code** (e.g. AEL_KOMKOD)
  - **Definition** (What does it measure?)
  - **Values/Categories** (e.g., 1=Married, 2=Unmarried)
  - **Period** (Years available)
  
  Format the output as a Markdown Table if multiple variables are found, or a detailed definition block if one specific variable is found.
  
  Example Table Format:
  | Code | Description | Dataset/Module | Years |
  | :--- | :--- | :--- | :--- |
  | ... | ... | ... | ... |

  Always provide the specific URL to the documentation page found.
  `;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
      config: {
        tools: [{ googleSearch: {} }],
      },
    });

    const text = response.text || "No variables found.";
    const chunks = response.candidates?.[0]?.groundingMetadata?.groundingChunks || [];
    
    const sources: GroundingSource[] = chunks
      .map(chunk => {
        if (chunk.web) {
          return { title: chunk.web.title || 'DST Documentation', uri: chunk.web.uri || '#' };
        }
        return null;
      })
      .filter((s): s is GroundingSource => s !== null);

    return { text, sources };
  } catch (error) {
    console.error("Gemini API Error:", error);
    return { text: "Unable to search variables right now.", sources: [] };
  }
};