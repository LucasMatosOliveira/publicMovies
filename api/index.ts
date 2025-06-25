import axios from "axios";

export class MovieAPI {

  private baseUrl = 'https://archive.org/advancedsearch.php';

  constructor() {
    this.findMovies = this.findMovies.bind(this);
    this.findMoviesPerTitle = this.findMoviesPerTitle.bind(this);
    this.findMoviesPerTitle2 = this.findMoviesPerTitle2.bind(this);
  }

  async findMovies(page: number = 1): Promise<Movie[]> {
    const response = await axios.get(this.baseUrl, {
      params: {
        q: 'collection:(feature_films) AND mediatype:(movies)',
        fl: ['identifier', 'title', 'description'],
        rows: 20,
        sort: ['avg_rating desc'],
        page,
        output: 'json'
      }
    });

    return response.data.response.docs as Movie[];
  }

  async findMoviesPerTitle(title: string): Promise<Movie[]> {
    const response = await axios.get(this.baseUrl, {
      params: {
        q: `collection:(feature_films) AND mediatype:(movies) AND title:(${title})`,
        fl: ['identifier', 'title', 'description'],
        rows: 20,
        output: 'json'
      }
    });

    return response.data.response.docs as Movie[];
  }

  async findMoviesPerTitle2(title: string): Promise<Movie[]> {
    const response = await axios.get(this.baseUrl, {
      params: {
        q: `collection:(feature_films) AND mediatype:(movies) AND identifier:(${title})`,
        fl: ['identifier', 'title', 'description'],
        rows: 20,
        output: 'json'
      }
    });

    return response.data.response.docs as Movie[];
  }
}

export interface Movie {
  identifier: string;
  title: string;
  description: string;
  creator: string;
  mediatype: string;
  collection: string;
  subject: string;
  date: string;
  downloads: number;
  publicdate: string;
  imagecount: number;
}
