import { useState, useEffect } from 'react';

interface Quote {
  text: string;
  author: string;
}

const quotes: Quote[] = [
  {
    text: "The only way to do great work is to love what you do. If you haven't found it yet, keep looking. Don't settle.",
    author: "Steve Jobs"
  },
  {
    text: "You are not your thoughts. You are the observer of your thoughts.",
    author: "Eckhart Tolle"
  },
  {
    text: "The present moment is the only time over which we have dominion.",
    author: "Thích Nhất Hạnh"
  },
  {
    text: "Mental health is not a destination, but a process. It's about how you drive, not where you're going.",
    author: "Noam Shpancer"
  },
  {
    text: "The greatest weapon against stress is our ability to choose one thought over another.",
    author: "William James"
  },
  {
    text: "You have been assigned this mountain to show others it can be moved.",
    author: "Mel Robbins"
  },
  {
    text: "Self-care is not selfish. You cannot serve from an empty vessel.",
    author: "Eleanor Brownn"
  },
  {
    text: "The mind is everything. What you think you become.",
    author: "Buddha"
  },
  {
    text: "Progress, not perfection, is the goal.",
    author: "Unknown"
  },
  {
    text: "Your mental health is a priority. Your happiness is essential. Your self-care is necessary.",
    author: "Unknown"
  },
  {
    text: "Healing takes time, and asking for help is a courageous step.",
    author: "Mariska Hargitay"
  },
  {
    text: "The privilege of a lifetime is to become who you truly are.",
    author: "Carl Jung"
  },
  {
    text: "You are allowed to be both a masterpiece and a work in progress simultaneously.",
    author: "Sophia Bush"
  },
  {
    text: "Mental health is not a luxury, it's a necessity.",
    author: "Unknown"
  },
  {
    text: "The strongest people are not those who show strength in front of us but those who win battles we know nothing about.",
    author: "Unknown"
  },
  {
    text: "You don't have to be perfect to be worthy of love and belonging.",
    author: "Brené Brown"
  },
  {
    text: "Recovery is not one and done. It is a lifelong journey that takes place one day, one step at a time.",
    author: "Unknown"
  },
  {
    text: "The way to get started is to quit talking and begin doing.",
    author: "Walt Disney"
  },
  {
    text: "Believe you can and you're halfway there.",
    author: "Theodore Roosevelt"
  },
  {
    text: "It's okay to not be okay. It's okay to ask for help. It's okay to take a break.",
    author: "Unknown"
  }
];

export const useLoginQuote = () => {
  const [quote, setQuote] = useState<Quote>(quotes[0]);

  useEffect(() => {
    const storedQuoteIndex = localStorage.getItem('lastQuoteIndex');
    let newQuoteIndex: number;
    
    if (storedQuoteIndex !== null) {
      // Get a different quote than the last one
      do {
        newQuoteIndex = Math.floor(Math.random() * quotes.length);
      } while (newQuoteIndex === parseInt(storedQuoteIndex));
    } else {
      newQuoteIndex = Math.floor(Math.random() * quotes.length);
    }

    const newQuote = quotes[newQuoteIndex];
    setQuote(newQuote);
    
    // Store the new quote index
    localStorage.setItem('lastQuoteIndex', newQuoteIndex.toString());
  }, []);

  return quote;
};
