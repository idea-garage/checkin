import { useParams, useNavigate } from "react-router-dom";
import { useEventQueries } from "@/hooks/event/useEventQueries";
import { Navbar } from "@/components/Navbar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Checkbox } from "@/components/ui/checkbox";
import { useToast } from "@/components/ui/use-toast";
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";

const Survey = () => {
  const { teamSlug, slug } = useParams();
  const { event, survey } = useEventQueries(teamSlug, slug);
  const { toast } = useToast();
  const [responses, setResponses] = useState<Record<string, string>>({});
  const [email, setEmail] = useState("");
  const [nickname, setNickname] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!event || !survey) {
      toast({
        title: "Error",
        description: "Survey or event data not found",
        variant: "destructive",
      });
      return;
    }

    try {
      // Create participant
      const { data: participant, error: participantError } = await supabase
        .from("participants")
        .insert({
          email,
          nickname: 'Survey user',
          event_id: event.id,
        })
        .select()
        .single();

      if (participantError) throw participantError;

      // Submit survey responses
      const surveyResponses = Object.entries(responses).map(([questionId, response]) => ({
        participant_id: null,
        question_id: questionId,
        response,
      }));

      const { error: responsesError } = await supabase
        .from("survey_responses")
        .insert(surveyResponses);

      if (responsesError) throw responsesError;

      toast({
        title: "Success",
        description: "Survey submitted successfully!",
      });

      // 3秒待ってからフォームをクリアし、トップページへ移動
      setTimeout(() => {
        setResponses({});
        setEmail("");
        setNickname("");
        navigate("/");  // トップページへ移動
      }, 3000);
    } catch (error: any) {
      console.error("Error submitting survey:", error);
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  if (!event || !survey) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <main className="container py-8">
          <div className="text-center">Loading...</div>
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
              <CardTitle>{event.name}</CardTitle>
              <CardTitle className="text-sm">{survey.title}</CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                {/*
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="nickname">Nickname</Label>
                    <Input
                      id="nickname"
                      value={nickname}
                      onChange={(e) => setNickname(e.target.value)}
                      required
                    />
                  </div>
                </div>
                */}

                {survey.questions?.map((question: any) => (
                  <div key={question.id} className="space-y-2">
                    <Label>{question.question}</Label>
                    {question.type === "radio" && (
                      <RadioGroup
                        onValueChange={(value) =>
                          setResponses({ ...responses, [question.id]: value })
                        }
                        value={responses[question.id]}
                      >
                        {question.options?.map((option: string) => (
                          <div key={option} className="flex items-center space-x-2">
                            <RadioGroupItem value={option} id={`${question.id}-${option}`} />
                            <Label htmlFor={`${question.id}-${option}`}>{option}</Label>
                          </div>
                        ))}
                      </RadioGroup>
                    )}
                    {question.type === "checkbox" && (
                      <div className="space-y-2">
                        {question.options?.map((option: string) => (
                          <div key={option} className="flex items-center space-x-2">
                            <Checkbox
                              id={`${question.id}-${option}`}
                              onCheckedChange={(checked) =>
                                setResponses({
                                  ...responses,
                                  [question.id]: checked ? option : "",
                                })
                              }
                            />
                            <Label htmlFor={`${question.id}-${option}`}>{option}</Label>
                          </div>
                        ))}
                      </div>
                    )}
                    {question.type === "text" && (
                      <Input
                        value={responses[question.id] || ""}
                        onChange={(e) =>
                          setResponses({ ...responses, [question.id]: e.target.value })
                        }
                      />
                    )}
                    {question.type === "multiline" && (
                      <textarea
                        value={responses[question.id] || ""}
                        onChange={(e) =>
                          setResponses({ ...responses, [question.id]: e.target.value })
                        }
                        className="w-full p-2 border rounded"
                        rows={4}
                      />
                    )}
                  </div>
                ))}

                <div className="flex justify-end">
                  <Button type="submit">Submit Survey</Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
};

export default Survey;