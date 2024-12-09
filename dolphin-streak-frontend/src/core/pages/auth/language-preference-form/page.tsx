import React, { useState } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { trpc } from '@/utils/trpc';
import { Button } from '@/components/ui/button';

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

const LanguagePreferenceForm: React.FC = () => {
  const [currentStep, setCurrentStep] = useState(0);
  const [selections, setSelections] = useState<Selections>({
    motherLanguage: '',
    learningLanguage: '',
    proficiencyLevel: '',
    learningTime: '',
  });

  const form = useForm<{ [K in SelectionKey]: string }>({
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
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleFormSubmit)}>
        <FormField
          control={form.control}
          name={currentOption.id as SelectionKey}
          render={({ field }) => (
            <FormItem>
              <FormLabel>{currentOption.label}</FormLabel>
              <Select
                onValueChange={(value) => {
                  field.onChange(value);
                  handleOptionSelect(currentOption.id as SelectionKey, value);
                }}
                defaultValue={field.value}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select an option" />
                </SelectTrigger>
                <SelectContent>
                  {currentOption.options.map((option) => (
                    <SelectItem key={option} value={option}>{option}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit" disabled={currentStep < options.length - 1}>
          {currentStep < options.length - 1 ? 'Next' : 'Submit'}
        </Button>
      </form>
    </Form>
  );
};

export default LanguagePreferenceForm;
