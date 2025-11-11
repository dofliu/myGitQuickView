import React from 'react';
import { ContributionData } from '../types';
import { useLocalization } from '../contexts/LocalizationContext';

interface ContributionGraphProps {
  data: ContributionData;
}

const getColorClass = (count: number): string => {
  if (count === 0) return 'bg-gray-800';
  if (count <= 2) return 'bg-cyan-900';
  if (count <= 5) return 'bg-cyan-700';
  if (count <= 9) return 'bg-cyan-500';
  return 'bg-cyan-300';
};

const ContributionGraph: React.FC<ContributionGraphProps> = ({ data }) => {
  const { t, language } = useLocalization();

  if (!data || !data.weeks.length) return null;

  const totalContributionsInPeriod = data.weeks.reduce((sum, week) =>
    sum + week.contributionDays.reduce((weekSum, day) => weekSum + day.contributionCount, 0), 0);

  const monthNames = React.useMemo(() => 
    Array.from({ length: 12 }, (_, i) => 
      new Date(0, i).toLocaleString(language, { month: 'short' })
    ), [language]);

  const monthLabels = data.weeks.reduce((acc, week, index) => {
    // A new month label is added if the first day of the week is in a new month
    // and it's not the same month as the last label
    const firstDayOfMonth = week.contributionDays[0];
    if (firstDayOfMonth) {
        const month = new Date(firstDayOfMonth.date).getMonth();
        if (!acc.some(label => label.month === monthNames[month])) {
            acc.push({ month: monthNames[month], index });
        }
    }
    return acc;
  }, [] as { month: string; index: number }[]);


  const allDays = data.weeks.flatMap(week => week.contributionDays);

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString(language, {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric',
    });
  }
  
  const getTooltipText = (day: { contributionCount: number, date: string }) => {
    const formattedDate = formatDate(day.date);
    if(day.contributionCount > 0){
        return t('contributionsOnDate')
            .replace('{count}', day.contributionCount.toString())
            .replace('{date}', formattedDate);
    }
    return t('noContributionsOnDate').replace('{date}', formattedDate);
  }

  return (
    <div className="bg-gray-800/50 p-6 rounded-xl border border-gray-700 h-full flex flex-col">
      <h3 className="text-md font-medium text-white mb-4">
        {t('contributionsInLast3Months').replace('{count}', totalContributionsInPeriod.toLocaleString())}
      </h3>
      <div className="flex-grow overflow-x-auto overflow-y-hidden">
        <div className="inline-flex flex-col">
           <div className="flex text-xs text-gray-400" style={{ paddingLeft: '28px' /* space for weekday labels */ }}>
            {monthLabels.map(({ month, index }, i) => {
              const nextMonthIndex = i + 1 < monthLabels.length ? monthLabels[i + 1].index : data.weeks.length;
              const weeksInMonth = nextMonthIndex - index;
              // Each week is 14px (w-3.5) + 4px (gap-1) = 18px wide
              const width = weeksInMonth * 18 - 4; // subtract last gap
              return (
                <div key={month + index} style={{ minWidth: `${width}px`}} className="mr-1">{month}</div>
              );
            })}
          </div>
          <div className="flex gap-3 mt-2">
            <div className="flex flex-col justify-between text-xs text-gray-400" style={{height: '118px' /* 7 * (14px + 4px) - 4px */ }}>
                <span></span>
                <span className="h-3.5 flex items-center">M</span>
                <span></span>
                <span className="h-3.5 flex items-center">W</span>
                <span></span>
                <span className="h-3.5 flex items-center">F</span>
                <span></span>
            </div>
            <div className="grid grid-flow-col grid-rows-7 gap-1">
              {allDays.map((day) => (
                <div
                  key={day.date}
                  className={`w-3.5 h-3.5 rounded-sm ${getColorClass(day.contributionCount)}`}
                  title={getTooltipText(day)}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContributionGraph;