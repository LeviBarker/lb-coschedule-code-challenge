import { Request, Response } from "express";
import axios, { AxiosResponse } from "axios";
import * as functions from "firebase-functions";
import { firebaseApp } from "../../admin";
import { chunk } from "lodash";

const BASE_PARAMS = {
  "api_key": functions.config().giphy.key,
  "lang": "en",
  "rating": "g",
  "limit": 25,
  "offset": 0
};
const firestore: FirebaseFirestore.Firestore = firebaseApp.firestore();

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
  private async buildSourceMap(chunks: any[][]) {
    const collectionResultMap: any = {};

    await Promise.all(chunks.map(async (chunk: any[]) => {
      const collectionRef = firestore
        .collection("item_metadata").where("source_id", "in", chunk);
      const docs = (await collectionRef.get()).docs;
      docs.forEach((doc: any) => {
        const docData = doc.data();
        collectionResultMap[docData.source_id] = {
          id: doc.id,
          ...docData
        };
      });
    }));
    return collectionResultMap;
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
        data: this.mergeDataWithSourceMap(collectionResultMap, data)
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
      const comments = (await firestore.collection("comments")
        .where("source_id", "==", id).get()).docs.map((doc: any) => (
          {
            id: doc.id,
            ...doc.data()
          }
        ));

      data.comments = comments;
      res.send(data);
    } catch (err) {
      throw new Error("Unable to get GIPHY response");
    }
  }
}
