import { GoogleGenAI } from "@google/genai";
import { Gig, Lead, Transaction } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const getManagerInsight = async (
  gigs: Gig[],
  leads: Lead[],
  finance: Transaction[]
): Promise<string> => {
  try {
    const recentGigs = gigs.slice(0, 5);
    const financeSummary = finance.reduce((acc, curr) => {
        if (curr.type === 'income') acc.income += curr.amount;
        else acc.expenses += curr.amount;
        return acc;
    }, { income: 0, expenses: 0 });

    const prompt = `
      Act as a world-class music career manager. Analyze the following data and give 3 distinct, actionable bullet points of advice to improve the musician's career and profitability. Keep it concise.

      Data:
      - Recent Gigs: ${JSON.stringify(recentGigs)}
      - Financial Snapshot: Income $${financeSummary.income}, Expenses $${financeSummary.expenses}
      - Active Leads Count: ${leads.length}
    `;

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
    });

    return response.text || "Unable to generate insights at this time.";
  } catch (error) {
    console.error("Error fetching AI insights:", error);
    return "AI Manager is currently offline. Please check your connection or API key.";
  }
};
