import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Navbar } from "@/components/Navbar";
import { Button } from "@/components/ui/button";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/components/ui/use-toast";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2 } from "lucide-react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useEventData } from "@/hooks/event/useEventData";

const Survey = () => {
  const { teamSlug, slug } = useParams();
  console.log('teamSlug', teamSlug);
  console.log('eventSlug', slug);

  const navigate = useNavigate();
  const { toast } = useToast();
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [participantId, setParticipantId] = useState<string | null>(null);

  const { eventData, loading: loadingEventData, error: eventError } = useEventData(teamSlug, slug);

  const eventId = eventData?.id;

  console.log('eventId', eventId);

  const { data: survey, isLoading: isLoadingSurvey } = useQuery({
    queryKey: ["survey", eventId],
    queryFn: async () => {
      if (!eventId) throw new Error("Event ID is undefined");

      const { data: surveyData, error: surveyError } = await supabase
        .from("surveys")
        .select("*")
        .eq("event_id", eventId)
        .single();

      if (surveyError) throw surveyError;

      const { data: questions, error: questionsError } = await supabase
        .from("survey_questions")
        .select("*")
        .eq("survey_id", surveyData.id)
        .order("created_at", { ascending: true });

      if (questionsError) throw questionsError;

      return {
        ...surveyData,
        questions,
      };
    },
    enabled: !!eventId,
  });

  const submitResponseMutation = useMutation({
    mutationFn: async (responses: { question_id: string; response: string }[]) => {
      const { error } = await supabase
        .from("survey_responses")
        .insert(
          responses.map((response) => ({
            ...response,
            participant_id: participantId,
          }))
        );

      if (error) throw error;
    },
    onSuccess: () => {
      toast({
        title: "Survey Submitted",
        description: "Thank you for your feedback!",
      });
    },
    onError: (error) => {
      toast({
        title: "Error Submitting Survey",
        description: "An error occurred while submitting the survey.",
        variant: "destructive",
      });
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!survey?.questions) return;

    const responses = survey.questions.map((question) => ({
      question_id: question.id,
      response: answers[question.id] || "",
    }));

    submitResponseMutation.mutate(responses);

    // フォーム送信後に回答をクリア
    setAnswers({});
  };

  if (loadingEventData || isLoadingSurvey) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <main className="container py-8">
          <div className="flex items-center justify-center">
            <Loader2 className="h-8 w-8 animate-spin" />
          </div>
        </main>
      </div>
    );
  }

  if (eventError || !survey) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <main className="container py-8">
          <Card>
            <CardContent className="py-8">
              <p className="text-center text-muted-foreground">
                {eventError ? "Error loading event data." : "No survey found for this event."}
              </p>
            </CardContent>
          </Card>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="container py-8">
        <div className="max-w-2xl mx-auto">
          <Card>
            <CardHeader>
              <CardTitle>{survey.title}</CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-8">
                {survey.questions.map((question: any) => (
                  <div key={question.id} className="space-y-4">
                    <h2 className="text-md font-semibold">{question.question}</h2>
                    {question.type === "multiple-choice" && Array.isArray(question.options) ? (
                      <RadioGroup
                        onValueChange={(value) =>
                          setAnswers((prev) => ({ ...prev, [question.id]: value }))
                        }
                        value={answers[question.id]}
                      >
                        {question.options.map((option: string) => (
                          <div key={option} className="flex items-center space-x-2">
                            <RadioGroupItem value={option} id={`${question.id}-${option}`} />
                            <Label htmlFor={`${question.id}-${option}`}>{option}</Label>
                          </div>
                        ))}
                      </RadioGroup>
                    ) : question.type === "text" ? (
                      <input
                        type="text"
                        placeholder=""
                        value={answers[question.id] || ""}
                        onChange={(e) =>
                          setAnswers((prev) => ({
                            ...prev,
                            [question.id]: e.target.value,
                          }))
                        }
                        className="w-full border rounded p-2"
                      />
                    ) : (
                      <Textarea
                        placeholder=""
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
                <Button
                  type="submit"
                  className="w-full"
                  disabled={submitResponseMutation.isPending}
                >
                  {submitResponseMutation.isPending ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Submitting...
                    </>
                  ) : (
                    "Submit Survey"
                  )}
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
};

export default Survey;