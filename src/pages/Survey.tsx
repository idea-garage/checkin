import { useState } from "react";
import { useParams } from "react-router-dom";
import { Navbar } from "@/components/Navbar";
import { Button } from "@/components/ui/button";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/components/ui/use-toast";

type Question = {
  id: number;
  type: "multiple-choice" | "open-ended";
  question: string;
  options?: string[];
};

const Survey = () => {
  const { eventId } = useParams();
  const { toast } = useToast();
  const [answers, setAnswers] = useState<Record<number, string>>({});

  // Example survey questions
  const questions: Question[] = [
    {
      id: 1,
      type: "multiple-choice",
      question: "How satisfied were you with the event?",
      options: ["Very Satisfied", "Satisfied", "Neutral", "Dissatisfied"],
    },
    {
      id: 2,
      type: "open-ended",
      question: "What suggestions do you have for future events?",
    },
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Submitted answers:", answers);
    toast({
      title: "Survey Submitted",
      description: "Thank you for your feedback!",
    });
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="container py-8">
        <div className="max-w-2xl mx-auto">
          <h1 className="text-3xl font-bold mb-8">Event Feedback Survey</h1>
          <form onSubmit={handleSubmit} className="space-y-8">
            {questions.map((question) => (
              <div key={question.id} className="space-y-4">
                <h2 className="text-xl font-semibold">{question.question}</h2>
                {question.type === "multiple-choice" ? (
                  <RadioGroup
                    onValueChange={(value) =>
                      setAnswers((prev) => ({ ...prev, [question.id]: value }))
                    }
                    value={answers[question.id]}
                  >
                    {question.options?.map((option) => (
                      <div key={option} className="flex items-center space-x-2">
                        <RadioGroupItem value={option} id={option} />
                        <Label htmlFor={option}>{option}</Label>
                      </div>
                    ))}
                  </RadioGroup>
                ) : (
                  <Textarea
                    placeholder="Type your answer here..."
                    value={answers[question.id] || ""}
                    onChange={(e) =>
                      setAnswers((prev) => ({
                        ...prev,
                        [question.id]: e.target.value,
                      }))
                    }
                  />
                )}
              </div>
            ))}
            <Button type="submit" className="w-full">
              Submit Survey
            </Button>
          </form>
        </div>
      </main>
    </div>
  );
};

export default Survey;