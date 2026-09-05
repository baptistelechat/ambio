export const proverbs: string[] = [
  "Petit à petit, l'oiseau fait son nid.",
  "L'habit ne fait pas le moine.",
  "Qui vivra verra.",
  "Pierre qui roule n'amasse pas mousse.",
  "Il n'y a pas de fumée sans feu.",
  "Chacun voit midi à sa porte.",
  "Le temps est un grand maître.",
  "Rira bien qui rira le dernier.",
  "On ne fait pas d'omelette sans casser des œufs.",
  "Vouloir, c'est pouvoir.",
  "À cœur vaillant rien d'impossible.",
  "Après la pluie, le beau temps.",
  "Ce que femme veut, Dieu le veut.",
  "Il faut battre le fer pendant qu'il est chaud.",
  "L'air ne fait pas la chanson.",
  "Les petits ruisseaux font les grandes rivières.",
  "Mieux vaut tard que jamais.",
  "Qui ne risque rien n'a rien.",
  "Tout vient à point à qui sait attendre.",
  "Un tiens vaut mieux que deux tu l'auras.",
];

export const getProverbOfTheDay = (date: Date = new Date()): string => {
  const start = Date.UTC(date.getFullYear(), 0, 0);
  const diff =
    Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()) - start;
  const dayOfYear = Math.floor(diff / 86_400_000);
  return proverbs[dayOfYear % proverbs.length];
};
