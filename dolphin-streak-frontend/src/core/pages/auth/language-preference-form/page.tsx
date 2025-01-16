import React, { useState } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { Select } from '@radix-ui/react-select';
import { useToast } from '@/hooks/use-toast';
import { trpc } from '@/utils/trpc';
import { Button } from '@/components/ui/button';
import { SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

type Selections = {
  language: string;
  motherLanguage: string;
  learningLanguage: string;
  proficiencyLevel: string;
  learningTime: string;
};

type SelectionKey = keyof Selections;

// Define the Option interface
interface Option {
  id: SelectionKey;
  label: string;
  options: string[];
}

const formSchema = z.object({
  language: z.string(),
  motherLanguage: z.string(),
  learningLanguage: z.string(),
  proficiencyLevel: z.string(),
  learningTime: z.string(),
});

export const LanguagePreferenceForm: React.FC = () => {
  const [currentStep, setCurrentStep] = useState(0);
  const [selections, setSelections] = useState<Selections>({
    language: '',
    motherLanguage: '',
    learningLanguage: '',
    proficiencyLevel: '',
    learningTime: '',
  });

  const form = useForm<Selections>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      language: '',
      motherLanguage: '',
      learningLanguage: '',
      proficiencyLevel: '',
      learningTime: '',
    },
  });

  const { toast } = useToast();
  const router = useRouter();
  const pathname = usePathname();
  const updateLanguagePreferences = trpc.auth.updateLanguagePreferences.useMutation();

  const handleOptionSelect = (key: SelectionKey, value: string) => {
    setSelections((prevSelections) => ({
      ...prevSelections,
      [key]: value,
    }));
    setCurrentStep((prevStep) => prevStep + 1);
  };

  const handleFormSubmit = async (data: Selections) => {
    try {
      await updateLanguagePreferences.mutateAsync({
        language: data.language,
        motherLanguage: data.motherLanguage,
        learningLanguage: data.learningLanguage,
        proficiencyLevel: data.proficiencyLevel,
        learningTime: data.learningTime,
      });
      toast({
        title: 'Success',
        description: 'Language preferences updated successfully',
      });
      router.push('/auth/success');
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to update language preferences',
        variant: 'destructive',
      });
    }
  };

  // Define the options array with the correct type
  const options: Option[] = [
    { id: 'language', label: 'Language', options: ['English', 'Spanish', 'French', 'German'] },
    { id: 'motherLanguage', label: 'Mother Language', options: ['English', 'Spanish', 'French', 'German'] },
    { id: 'learningLanguage', label: 'Learning Language', options: ['English', 'Spanish', 'French', 'German'] },
    { id: 'proficiencyLevel', label: 'Proficiency Level', options: ['Beginner', 'Intermediate', 'Advanced'] },
    { id: 'learningTime', label: 'Learning Time', options: ['15 minutes', '30 minutes', '45 minutes', '60 minutes'] },
  ];

  const currentOption = options[currentStep];

  return (
    <form onSubmit={form.handleSubmit(handleFormSubmit)}>
      <Select
        onValueChange={(value) => {
          form.setValue(currentOption.id, value);
          handleOptionSelect(currentOption.id, value);
        }}
        defaultValue={form.getValues(currentOption.id)}
      >
        <SelectTrigger>
          <SelectValue placeholder="Select an option" />
        </SelectTrigger>
        <SelectContent>
          {currentOption.options.map((option) => (
            <SelectItem key={option} value={option}>
              {option}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      <Button type="submit" disabled={currentStep < options.length - 1}>
        {currentStep < options.length - 1 ? 'Next' : 'Submit'}
      </Button>
    </form>
  );
};