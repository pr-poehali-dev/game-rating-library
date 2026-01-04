import { useState } from 'react';
import Icon from '@/components/ui/icon';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Slider } from '@/components/ui/slider';
import { useToast } from '@/hooks/use-toast';

interface GameRating {
  story: number;
  context: number;
  atmosphere: number;
  gameplay: number;
  visual: number;
  sound: number;
  personal: number;
}

interface Game {
  id: string;
  title: string;
  year: number;
  imageUrl: string;
  rating?: GameRating;
  description: string;
}

const Index = () => {
  const { toast } = useToast();
  const [games, setGames] = useState<Game[]>([
    {
      id: '1',
      title: 'The Witcher 3: Wild Hunt',
      year: 2015,
      imageUrl: '/placeholder.svg',
      rating: {
        story: 9,
        context: 10,
        atmosphere: 10,
        gameplay: 8,
        visual: 9,
        sound: 9,
        personal: 10
      },
      description: 'Эпическая RPG с глубоким сюжетом и открытым миром'
    },
    {
      id: '2',
      title: 'Cyberpunk 2077',
      year: 2020,
      imageUrl: '/placeholder.svg',
      description: 'Футуристическая RPG в мире киберпанка'
    }
  ]);

  const [filterYear, setFilterYear] = useState<string>('all');
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [selectedGame, setSelectedGame] = useState<Game | null>(null);
  
  const [newGame, setNewGame] = useState({
    title: '',
    year: new Date().getFullYear(),
    imageUrl: '/placeholder.svg',
    description: ''
  });

  const [editRating, setEditRating] = useState<GameRating>({
    story: 5,
    context: 5,
    atmosphere: 5,
    gameplay: 5,
    visual: 5,
    sound: 5,
    personal: 5
  });

  const calculateFinalScore = (rating: GameRating) => {
    const weights = {
      story: 0.20,
      context: 0.10,
      atmosphere: 0.15,
      gameplay: 0.25,
      visual: 0.10,
      sound: 0.10,
      personal: 0.10
    };

    return Math.round(
      rating.story * weights.story * 10 +
      rating.context * weights.context * 10 +
      rating.atmosphere * weights.atmosphere * 10 +
      rating.gameplay * weights.gameplay * 10 +
      rating.visual * weights.visual * 10 +
      rating.sound * weights.sound * 10 +
      rating.personal * weights.personal * 10
    );
  };

  const handleAddGame = () => {
    const game: Game = {
      id: Date.now().toString(),
      ...newGame
    };
    setGames([...games, game]);
    setNewGame({
      title: '',
      year: new Date().getFullYear(),
      imageUrl: '/placeholder.svg',
      description: ''
    });
    setIsAddDialogOpen(false);
    toast({
      title: 'Игра добавлена!',
      description: `${game.title} появилась в вашей библиотеке`
    });
  };

  const handleSaveRating = () => {
    if (!selectedGame) return;
    
    const updatedGames = games.map(g => 
      g.id === selectedGame.id ? { ...g, rating: editRating } : g
    );
    setGames(updatedGames);
    setSelectedGame(null);
    toast({
      title: 'Оценка сохранена!',
      description: `Итоговый балл: ${calculateFinalScore(editRating)}/100`
    });
  };

  const openRatingDialog = (game: Game) => {
    setSelectedGame(game);
    setEditRating(game.rating || {
      story: 5,
      context: 5,
      atmosphere: 5,
      gameplay: 5,
      visual: 5,
      sound: 5,
      personal: 5
    });
  };

  const filteredGames = filterYear === 'all' 
    ? games 
    : games.filter(g => g.year.toString() === filterYear);

  const ratedGames = games.filter(g => g.rating).length;
  const unratedGames = games.length - ratedGames;
  const years = Array.from(new Set(games.map(g => g.year))).sort((a, b) => b - a);

  const ratingCriteria = [
    { key: 'story', label: 'Смысл игры', weight: '20%' },
    { key: 'context', label: 'Контекст и Лор', weight: '10%' },
    { key: 'atmosphere', label: 'Пространство и атмосфера', weight: '15%' },
    { key: 'gameplay', label: 'Игровое взаимодействие', weight: '25%' },
    { key: 'visual', label: 'Визуальное выражение', weight: '10%' },
    { key: 'sound', label: 'Звуковая среда', weight: '10%' },
    { key: 'personal', label: 'Личное впечатление', weight: '10%' }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted">
      <div className="container mx-auto px-4 py-8">
        <header className="mb-12 animate-fade-in">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-5xl font-bold bg-gradient-to-r from-primary via-secondary to-accent bg-clip-text text-transparent mb-2">
                🎮 Game Library
              </h1>
              <p className="text-muted-foreground text-lg">Твоя персональная библиотека игр с уникальной системой оценивания</p>
            </div>
            
            <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
              <DialogTrigger asChild>
                <Button size="lg" className="bg-gradient-to-r from-primary to-secondary hover:opacity-90 transition-all hover:scale-105">
                  <Icon name="Plus" size={20} className="mr-2" />
                  Добавить игру
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-md">
                <DialogHeader>
                  <DialogTitle>Добавить новую игру</DialogTitle>
                  <DialogDescription>Заполни информацию об игре. Оценку можно добавить позже.</DialogDescription>
                </DialogHeader>
                <div className="space-y-4 py-4">
                  <div>
                    <Label htmlFor="title">Название игры</Label>
                    <Input
                      id="title"
                      value={newGame.title}
                      onChange={(e) => setNewGame({ ...newGame, title: e.target.value })}
                      placeholder="The Last of Us"
                    />
                  </div>
                  <div>
                    <Label htmlFor="year">Год выпуска</Label>
                    <Input
                      id="year"
                      type="number"
                      value={newGame.year}
                      onChange={(e) => setNewGame({ ...newGame, year: parseInt(e.target.value) })}
                    />
                  </div>
                  <div>
                    <Label htmlFor="description">Описание</Label>
                    <Textarea
                      id="description"
                      value={newGame.description}
                      onChange={(e) => setNewGame({ ...newGame, description: e.target.value })}
                      placeholder="Краткое описание игры..."
                      rows={3}
                    />
                  </div>
                </div>
                <DialogFooter>
                  <Button onClick={handleAddGame} disabled={!newGame.title}>
                    Добавить в библиотеку
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <Card className="bg-gradient-to-br from-primary/20 to-primary/5 border-primary/30">
              <CardHeader className="pb-3">
                <CardTitle className="text-2xl flex items-center gap-2">
                  <Icon name="Library" size={24} />
                  {games.length}
                </CardTitle>
                <CardDescription>Всего игр</CardDescription>
              </CardHeader>
            </Card>
            
            <Card className="bg-gradient-to-br from-secondary/20 to-secondary/5 border-secondary/30">
              <CardHeader className="pb-3">
                <CardTitle className="text-2xl flex items-center gap-2">
                  <Icon name="Star" size={24} />
                  {ratedGames}
                </CardTitle>
                <CardDescription>Оценено</CardDescription>
              </CardHeader>
            </Card>

            <Card className="bg-gradient-to-br from-accent/20 to-accent/5 border-accent/30">
              <CardHeader className="pb-3">
                <CardTitle className="text-2xl flex items-center gap-2">
                  <Icon name="Clock" size={24} />
                  {unratedGames}
                </CardTitle>
                <CardDescription>Без оценки</CardDescription>
              </CardHeader>
            </Card>
          </div>

          <div className="flex items-center gap-4">
            <Label className="text-sm font-semibold">Фильтр по году:</Label>
            <Select value={filterYear} onValueChange={setFilterYear}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Все годы" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Все годы</SelectItem>
                {years.map(year => (
                  <SelectItem key={year} value={year.toString()}>
                    {year}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredGames.map((game, index) => (
            <Card 
              key={game.id} 
              className="overflow-hidden hover:scale-105 transition-all duration-300 hover:shadow-2xl hover:shadow-primary/20 animate-scale-in"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <div className="relative h-48 bg-gradient-to-br from-primary/10 to-secondary/10 overflow-hidden">
                <img 
                  src={game.imageUrl} 
                  alt={game.title}
                  className="w-full h-full object-cover"
                />
                <div className="absolute top-3 right-3">
                  <Badge variant="secondary" className="font-bold">
                    {game.year}
                  </Badge>
                </div>
                {game.rating && (
                  <div className="absolute bottom-3 left-3">
                    <div className="bg-gradient-to-r from-primary to-secondary text-white px-4 py-2 rounded-lg font-bold text-2xl shadow-lg">
                      {calculateFinalScore(game.rating)}
                      <span className="text-sm ml-1">/100</span>
                    </div>
                  </div>
                )}
              </div>
              
              <CardHeader>
                <CardTitle className="text-xl">{game.title}</CardTitle>
                <CardDescription className="line-clamp-2">{game.description}</CardDescription>
              </CardHeader>
              
              <CardContent>
                <Button 
                  onClick={() => openRatingDialog(game)}
                  variant={game.rating ? "outline" : "default"}
                  className="w-full"
                >
                  <Icon name={game.rating ? "Edit" : "Plus"} size={18} className="mr-2" />
                  {game.rating ? 'Изменить оценку' : 'Добавить оценку'}
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>

        <Dialog open={!!selectedGame} onOpenChange={() => setSelectedGame(null)}>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>{selectedGame?.title}</DialogTitle>
              <DialogDescription>
                Оцени игру по каждому критерию от 1 до 10
              </DialogDescription>
            </DialogHeader>
            
            <div className="space-y-6 py-4">
              {ratingCriteria.map(({ key, label, weight }) => (
                <div key={key} className="space-y-2">
                  <div className="flex justify-between items-center">
                    <Label className="font-semibold">{label}</Label>
                    <div className="flex items-center gap-2">
                      <Badge variant="outline" className="text-xs">{weight}</Badge>
                      <span className="text-2xl font-bold text-primary w-8 text-right">
                        {editRating[key as keyof GameRating]}
                      </span>
                    </div>
                  </div>
                  <Slider
                    value={[editRating[key as keyof GameRating]]}
                    onValueChange={(value) => setEditRating({ ...editRating, [key]: value[0] })}
                    min={1}
                    max={10}
                    step={1}
                    className="w-full"
                  />
                </div>
              ))}

              <div className="pt-4 border-t">
                <div className="flex justify-between items-center">
                  <span className="text-lg font-bold">Итоговая оценка:</span>
                  <span className="text-4xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                    {calculateFinalScore(editRating)}/100
                  </span>
                </div>
              </div>
            </div>
            
            <DialogFooter>
              <Button variant="outline" onClick={() => setSelectedGame(null)}>
                Отмена
              </Button>
              <Button onClick={handleSaveRating} className="bg-gradient-to-r from-primary to-secondary">
                Сохранить оценку
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
};

export default Index;
