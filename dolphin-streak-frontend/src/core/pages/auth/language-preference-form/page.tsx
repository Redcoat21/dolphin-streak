import React, { useState } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { Select } from '@radix-ui/react-select';
import { useToast } from 'hooks/use-toast';
import { trpc } from 'utils/trpc';
import { Button } from 'components/ui/button';

type Selections = {
  motherLanguage: string;
  learningLanguage: string;
  proficiencyLevel: string;
  learningTime: string;
};

type SelectionKey = keyof Selections;

const formSchema = z.object({
  motherLanguage: z.string(),
  learningLanguage: z.string(),
  proficiencyLevel: z.string(),
  learningTime: z.string(),
});

export const LanguagePreferenceForm: React.FC = () => {
  const [currentStep, setCurrentStep] = useState(0);
  const [selections, setSelections] = useState<Selections>({
    motherLanguage: '',
    learningLanguage: '',
    proficiencyLevel: '',
    learningTime: '',
  });

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
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

  const handleFormSubmit = async (data: { [K in SelectionKey]: string }) => {
    try {
      await updateLanguagePreferences.mutateAsync({
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

  const options = [
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
          form.setValue(currentOption.id as SelectionKey, value);
          handleOptionSelect(currentOption.id as SelectionKey, value);
        }}
        defaultValue={form.getValues(currentOption.id as SelectionKey)}
      >
        <Select.Trigger>
          <Select.Value placeholder="Select an option" />
        </Select.Trigger>
        <Select.Content>
          {currentOption.options.map((option) => (
            <Select.Item key={option} value={option}>
              {option}
            </Select.Item>
          ))}
        </Select.Content>
      </Select>
      <Button type="submit" disabled={currentStep < options.length - 1}>
        {currentStep < options.length - 1 ? 'Next' : 'Submit'}
      </Button>
    </form>
  );
};
