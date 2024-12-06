import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { ManageLayout } from "@/components/manage/ManageLayout";

const SurveyList = () => {
  const [surveys, setSurveys] = useState([]);

  useEffect(() => {
    const fetchSurveys = async () => {
      const { data, error } = await supabase.from('surveys').select('*');
      if (error) {
        console.error('Error fetching surveys:', error);
      } else {
        setSurveys(data);
      }
    };

    fetchSurveys();
  }, []);

  return (
    <ManageLayout>
      <div>
        <h2>Survey List</h2>
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