import { Request, Response } from "express";
import axios, { AxiosResponse } from "axios";
import * as functions from "firebase-functions";
import { chunk } from "lodash";
import { FirebaseDAOAdapter } from "../../dao/firestore-dao-adapter";

const BASE_PARAMS = {
  "api_key": functions.config().giphy.key,
  "lang": "en",
  "rating": "g",
  "limit": 25,
  "offset": 0
};

/**
 * @description SearchController
 */
export class SearchController {
  /**
   * @description Chunk IDs from array
   * @param {data}
   * @returns
   */
  private getIdChunksFromData(data: any[]): any[][] {
    const sourceIds: any[] = data.map((item: any) => item.id);
    return chunk(sourceIds, 10);
  }

  /**
   * @description Build source map from firebase collection
   * @param {chunks}
   * @returns
   */
  private async buildSourceMap(chunks: any[][]): Promise<any> {
    const collectionValueMap: any = {};

    await Promise.all(chunks.map(async (chunk: any[]) => {
      const data: any[] = await FirebaseDAOAdapter.getCollectionValues("item_metadata", [
        {
          field: "sourceId",
          operator: "in",
          value: chunk
        }
      ]);

      data.forEach((item: any) => {
        if (item?.sourceId) {
          collectionValueMap[item?.sourceId] = item;
        }
      });

      return data;
    }));
  
    return collectionValueMap;
  }

  /**
   * @description Merge Firebase source map with data
   * @param {sourceMap}
   * @param {data}
   * @returns
   */
  private mergeDataWithSourceMap(sourceMap: any, data: any[]) {
    return data.map((item: any) => {
      return {
        ...item,
        firebaseMetadata: sourceMap[item.id]
      };
    });
  }

  /**
   * @description Search Giphy API
   * @param {req}
   * @param {res}
   */
  async searchGiphy(req: Request, res: Response): Promise<void> {
    try {
      const giphyResponse: AxiosResponse = await axios.get("https://api.giphy.com/v1/gifs/search", {
        params: {
          ...BASE_PARAMS,
          q: req.query.text
        }
      });

      const { data }: { data: any[] } = giphyResponse.data;
      const chunks: any[][] = this.getIdChunksFromData(data);

      const collectionResultMap: any = await this.buildSourceMap(chunks);

      res.send({
        data: this.mergeDataWithSourceMap(collectionResultMap, data),
        collectionResultMap
      });
    } catch (err) {
      throw new Error("Unable to get GIPHY response");
    }
  }

  /**
   * Get Giphy object by ID with metadata
   * @param req
   * @param res
   */
  async getGifById(req: Request, res: Response): Promise<void> {
    try {
      const id: string = req.params?.id;
      const giphyResponse: AxiosResponse = await axios.get(`https://api.giphy.com/v1/gifs/${id}`, {
        params: {
          ...BASE_PARAMS,
          q: req.query.text
        }
      });

      const { data }: { data: any } = giphyResponse.data;

      const comments: Comment[] = await FirebaseDAOAdapter.getCollectionValues("comments", [{
        field: "sourceId",
        operator: "==",
        value: id
      }]);

      data.comments = comments;
      res.send(data);
    } catch (err) {
      throw new Error("Unable to get GIPHY response");
    }
  }
}
