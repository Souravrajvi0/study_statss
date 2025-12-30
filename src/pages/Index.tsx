import { CircularProgress } from "@/components/CircularProgress";
import { TrendIndicator } from "@/components/TrendIndicator";
import { WeeklyChart } from "@/components/WeeklyChart";
import { StudyCalendar } from "@/components/StudyCalendar";
import { StatsCard } from "@/components/StatsCard";
import { useStudyData } from "@/hooks/useStudyData";
import { BookOpen, Calendar, Clock, Target } from "lucide-react";

const Index = () => {
  const {
    isLoaded,
    logHours,
    getHoursForDate,
    getLifetimeAverage,
    getRunningAverageUntil,
    getCurrentWeekAverage,
    getWeekOverWeekChange,
    getWeeklyChartData,
    getTotalDays,
    getTotalHours,
  } = useStudyData();

  if (!isLoaded) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="animate-pulse text-muted-foreground">Loading...</div>
      </div>
    );
  }

  const lifetimeAverage = getLifetimeAverage();
  const weekChange = getWeekOverWeekChange();
  const currentWeekAvg = getCurrentWeekAverage();
  const chartData = getWeeklyChartData();
  const totalDays = getTotalDays();
  const totalHours = getTotalHours();

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-card/50 backdrop-blur-sm sticky top-0 z-10">
        <div className="container py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-primary/10">
              <BookOpen className="w-6 h-6 text-primary" />
            </div>
            <h1 className="text-xl font-display font-bold text-foreground">
              Study Tracker
            </h1>
          </div>
          <p className="text-sm text-muted-foreground hidden sm:block">
            Track your progress, build consistency
          </p>
        </div>
      </header>

      <main className="container py-8 space-y-8">
        {/* Hero Section - Lifetime Average */}
        <section className="text-center space-y-6 animate-fade-in">
          <div className="space-y-2">
            <h2 className="text-sm font-medium text-muted-foreground uppercase tracking-wider">
              Lifetime Average
            </h2>
            <p className="text-muted-foreground text-sm">
              Your daily study average since day one
            </p>
          </div>

          <div className="flex justify-center">
            <CircularProgress value={lifetimeAverage} />
          </div>

          <TrendIndicator change={weekChange} />
        </section>

        {/* Stats Grid */}
        <section className="grid grid-cols-2 lg:grid-cols-4 gap-4 animate-fade-in" style={{ animationDelay: '0.1s' }}>
          <StatsCard
            title="This Week"
            value={`${currentWeekAvg.toFixed(1)}h`}
            subtitle="avg per day"
            icon={Target}
          />
          <StatsCard
            title="Total Hours"
            value={totalHours.toFixed(0)}
            subtitle="all time"
            icon={Clock}
          />
          <StatsCard
            title="Days Tracked"
            value={totalDays.toString()}
            subtitle="since start"
            icon={Calendar}
          />
          <StatsCard
            title="Study Days"
            value={chartData.filter(w => w.average > 0).length.toString()}
            subtitle="active weeks"
            icon={BookOpen}
          />
        </section>

        {/* Weekly Trend Chart */}
        <section className="bg-card rounded-2xl p-6 border border-border shadow-soft animate-fade-in" style={{ animationDelay: '0.2s' }}>
          <div className="mb-6">
            <h3 className="text-lg font-display font-semibold text-foreground">
              Weekly Trend
            </h3>
            <p className="text-sm text-muted-foreground">
              Average hours per day over the last 8 weeks
            </p>
          </div>
          <WeeklyChart data={chartData} />
        </section>

        {/* Calendar Section */}
        <section className="bg-card rounded-2xl p-6 border border-border shadow-soft animate-fade-in" style={{ animationDelay: '0.3s' }}>
          <div className="mb-6">
            <h3 className="text-lg font-display font-semibold text-foreground">
              Log Your Hours
            </h3>
            <p className="text-sm text-muted-foreground">
              Click on a day to log study hours. Hover to see running average.
            </p>
          </div>
          <StudyCalendar
            getHoursForDate={getHoursForDate}
            getRunningAverageUntil={getRunningAverageUntil}
            onLogHours={logHours}
          />
        </section>

        {/* Heatmap Legend */}
        <section className="flex items-center justify-center gap-2 text-xs text-muted-foreground animate-fade-in" style={{ animationDelay: '0.4s' }}>
          <span>Less</span>
          <div className="flex gap-1">
            <div className="w-4 h-4 rounded bg-heatmap-0" />
            <div className="w-4 h-4 rounded bg-heatmap-1" />
            <div className="w-4 h-4 rounded bg-heatmap-2" />
            <div className="w-4 h-4 rounded bg-heatmap-3" />
            <div className="w-4 h-4 rounded bg-heatmap-4" />
            <div className="w-4 h-4 rounded bg-heatmap-5" />
          </div>
          <span>More</span>
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t border-border py-6 mt-8">
        <div className="container text-center text-sm text-muted-foreground">
          <p>Your data is stored locally in your browser</p>
        </div>
      </footer>
    </div>
  );
};

export default Index;
