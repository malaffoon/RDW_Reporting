/**
 * Represents a script
 */
export interface Script {
  /**
   * The language the script is written in
   */
  language: string;

  /**
   * The script code
   */
  body?: string;
}

export interface IngestPipelineScript extends Script {
  /**
   * The script ID
   */
  id?: number;

  /**
   * The user given script name
   */
  name?: string;

  /**
   * The semantic version of the script
   */
  version?: string;

  /**
   * The script creation datetime
   */
  createdOn?: Date;

  /**
   * The script updated datetime
   */
  updatedOn?: Date;

  /**
   * The position of the script in the pipeline or undefined if not in the pipeline
   */
  index?: number;
}
