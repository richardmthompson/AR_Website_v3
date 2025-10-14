import { Card, CardContent } from '@/components/ui/card';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Mail, Linkedin } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import type { TeamMember } from '@/lib/team-data';

interface TeamMemberCardProps {
  member: TeamMember;
}

export function TeamMemberCard({ member }: TeamMemberCardProps) {
  const { t, i18n } = useTranslation();
  const currentLang = (i18n.language === 'de' ? 'de' : 'en') as 'en' | 'de';

  const initials = member.name
    .split(' ')
    .map(n => n[0])
    .join('');

  return (
    <Card className="group h-full flex flex-col p-8 hover:shadow-xl hover:scale-[1.02] transition-all duration-300 border-2 hover:border-primary">
      {/* Header: Avatar + Name/Title */}
      <div className="flex items-start gap-4 mb-6">
        <Avatar className="h-40 w-40">
          <AvatarImage src={member.image} alt={`${member.name}, ${member.title[currentLang]}`} />
          <AvatarFallback className="text-2xl">{initials}</AvatarFallback>
        </Avatar>
        <div>
          <h3 className="text-2xl font-bold text-primary mb-1">{member.name}</h3>
          <p className="text-base text-muted-foreground">{member.title[currentLang]}</p>
        </div>
      </div>

      {/* Bio */}
      <p className="text-sm text-foreground leading-relaxed mb-6">
        {member.bio[currentLang]}
      </p>

      {/* Credentials */}
      {member.credentials[currentLang].length > 0 && (
        <div className="mb-6">
          <h4 className="font-semibold text-sm mb-2 text-foreground">{t('team.credentialsTitle')}</h4>
          <ul className="space-y-1 text-sm text-muted-foreground">
            {member.credentials[currentLang].map((cred, idx) => (
              <li key={idx}>• {cred}</li>
            ))}
          </ul>
        </div>
      )}

      {/* Expertise Badges */}
      {member.expertise[currentLang].length > 0 && (
        <div className="flex flex-wrap gap-2 mb-6">
          {member.expertise[currentLang].map((skill, idx) => (
            <Badge key={idx} variant="secondary">{skill}</Badge>
          ))}
        </div>
      )}

      {/* Contact Links (pushed to bottom) */}
      <div className="flex gap-3 mt-auto">
        {member.linkedin && (
          <a
            href={member.linkedin}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-primary/10 text-primary hover:bg-primary hover:text-white transition-colors"
            aria-label={`${member.name}'s LinkedIn profile`}
          >
            <Linkedin className="w-5 h-5" />
          </a>
        )}
        {member.email && (
          <a
            href={`mailto:${member.email}`}
            className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-primary/10 text-primary hover:bg-primary hover:text-white transition-colors"
            aria-label={`Email ${member.name}`}
          >
            <Mail className="w-5 h-5" />
          </a>
        )}
      </div>
    </Card>
  );
}
