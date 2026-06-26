import { FoodRecord, TrainingSetLog } from "../models/types";

export type FitnessRepository = {
  listTrainingLogs(): Promise<TrainingSetLog[]>;
  saveTrainingLog(log: TrainingSetLog): Promise<void>;
  listFoodRecords(): Promise<FoodRecord[]>;
  saveFoodRecord(record: FoodRecord): Promise<void>;
};

export class InMemoryFitnessRepository implements FitnessRepository {
  private trainingLogs: TrainingSetLog[] = [];
  private foodRecords: FoodRecord[] = [];

  async listTrainingLogs() {
    return this.trainingLogs;
  }

  async saveTrainingLog(log: TrainingSetLog) {
    this.trainingLogs = [log, ...this.trainingLogs];
  }

  async listFoodRecords() {
    return this.foodRecords;
  }

  async saveFoodRecord(record: FoodRecord) {
    this.foodRecords = [record, ...this.foodRecords];
  }
}
