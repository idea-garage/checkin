import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { ManageLayout } from "@/components/manage/ManageLayout";
import { fetchSurveys, addSurvey } from "@/integrations/supabase/surveyService";

const SurveyList = ({ eventId }) => {
  const [surveys, setSurveys] = useState([]);
  const [newSurveyTitle, setNewSurveyTitle] = useState('');

  useEffect(() => {
    const loadSurveys = async () => {
      const data = await fetchSurveys();
      setSurveys(data);
    };

    loadSurveys();
  }, []);

  const handleAddSurvey = async () => {
    if (newSurveyTitle.trim() === '') return;

    const data = await addSurvey(newSurveyTitle, eventId);
    if (data) {
      setSurveys([...surveys, ...data]);
      setNewSurveyTitle('');
    }
  };

  return (
    <ManageLayout>
      <div>
        <h2>Survey List</h2>
        <input
          type="text"
          value={newSurveyTitle}
          onChange={(e) => setNewSurveyTitle(e.target.value)}
          placeholder="Enter survey title"
          className="border p-2 mb-2"
        />
        <Button onClick={handleAddSurvey}>Add Survey</Button>
        {surveys.map(survey => (
          <div key={survey.id} className="flex items-center gap-2 mb-2">
            <span>{survey.title}</span>
            <Button onClick={() => {/* Navigate to SurveyQuestions with survey.id */}}>Manage Questions</Button>
          </div>
        ))}
      </div>
    </ManageLayout>
  );
};

export default SurveyList; 