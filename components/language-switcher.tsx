'use client';

import * as React from 'react';
import { Check, ChevronsUpDown, Globe } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
} from '@/components/ui/command';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { useLanguage, UI_LANGUAGES } from '@/lib/context/language-context';
import { useTranslation } from '@/lib/i18n/hooks';

export function LanguageSwitcher() {
  const { language, setLanguage } = useLanguage();
  const { t } = useTranslation();
  const [open, setOpen] = React.useState(false);

  // Create language options from UI_LANGUAGES
  const languages = [
    { value: UI_LANGUAGES.ENGLISH, label: t('languages.english'), flag: '🇬🇧' },
    { value: UI_LANGUAGES.GERMAN, label: t('languages.german'), flag: '🇩🇪' },
    { value: UI_LANGUAGES.FRENCH, label: t('languages.french'), flag: '🇫🇷' },
  ];

  // Find the current language display data
  const currentLanguage = languages.find(lang => lang.value === language) || languages[0];

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          aria-label={t('common.changeLanguage')}
          className="w-full justify-between"
        >
          <div className="flex items-center gap-2">
            <Globe className="h-4 w-4" />
            <span>{currentLanguage.flag}</span>
            <span>{currentLanguage.label}</span>
          </div>
          <ChevronsUpDown className="ml-auto h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[200px] p-0">
        <Command>
          <CommandInput placeholder={t('common.changeLanguage')} />
          <CommandEmpty>No language found.</CommandEmpty>
          <CommandGroup>
            {languages.map((lang) => (
              <CommandItem
                key={lang.value}
                onSelect={() => {
                  setLanguage(lang.value);
                  setOpen(false);
                }}
                className="text-sm"
              >
                <div className="flex items-center gap-2">
                  <span>{lang.flag}</span>
                  <span>{lang.label}</span>
                </div>
                <Check
                  className={cn(
                    "ml-auto h-4 w-4",
                    language === lang.value ? "opacity-100" : "opacity-0"
                  )}
                />
              </CommandItem>
            ))}
          </CommandGroup>
        </Command>
      </PopoverContent>
    </Popover>
  );
} 