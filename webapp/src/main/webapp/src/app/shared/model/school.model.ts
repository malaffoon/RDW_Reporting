/**
 * This model represents a School.
 */
export class School {

  /**
   * @param _id   The school id
   * @param _name The school display name
   */
  constructor(private _id: number, private _name: string) {
  }

  /**
   * @returns {number} The school id
   */
  get id(): number {
    return this._id;
  }

  /**
   * @returns {string} The school display name
   */
  get name(): string {
    return this._name;
  }
}
