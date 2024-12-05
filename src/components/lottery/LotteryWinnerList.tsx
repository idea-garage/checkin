import { Globe, MapPin } from "lucide-react";

interface Winner {
  round: number;
  participants: {
    nickname: string;
    email?: string;
    attendance_mode: string;
  };
}

interface LotteryWinnerListProps {
  winners: Winner[];
  isStaff?: boolean;
}

export const LotteryWinnerList = ({ winners, isStaff }: LotteryWinnerListProps) => {
  const getAttendanceIcon = (mode: string) => {
    return mode === 'online' ? (
      <Globe className="h-4 w-4" />
    ) : (
      <MapPin className="h-4 w-4" />
    );
  };

  if (!winners?.length) {
    return (
      <div className="text-center text-muted-foreground">
        No winners have been selected yet
      </div>
    );
  }

  return (
    <div className="divide-y">
      {winners.map((winner) => (
        <div key={`${winner.round}-${winner.participants?.nickname}`} className="py-3">
          <div className="flex items-center justify-between">
            <div>
              <div className="font-medium">
                Round {winner.round}: {winner.participants?.nickname}
              </div>
              {isStaff && winner.participants?.email && (
                <div className="text-sm text-muted-foreground">
                  {winner.participants.email}
                </div>
              )}
            </div>
            <div className="flex items-center gap-2 text-muted-foreground">
              {getAttendanceIcon(winner.participants?.attendance_mode)}
              <span className="text-sm">
                {winner.participants?.attendance_mode === 'online' ? 'Online' : 'In Person'}
              </span>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};