export type Snippet = {
  id: string;
  title: string;
  language: string;
  code: string;
  tags: string;
  folderId: string | null;
  isFavorite: boolean;
  createdAt: string;
};
