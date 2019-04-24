export type InputType = 'xml' | 'json' | 'csv';

export const inputTypes = ['xml', 'json', 'csv'];

/**
 * Represents an ingest pipeline
 */
export interface Pipeline {
  /**
   * The pipeline identifier
   */
  id: string;

  /**
   * The pipeline name
   */
  name: string;

  /**
   * The pipeline description
   */
  description: string;

  /**
   * The pipeline input format
   * This can be XML, CSV etc.
   */
  inputType: InputType;

  /**
   * The pipeline script
   */
  script?: PipelineScript;

  /**
   * The pipeline tests
   */
  tests?: PipelineTest[];
}

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

export interface PipelineScript extends Script {
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
   * The user who updated the script last
   */
  updatedBy?: string;

  /**
   * The position of the script in the pipeline or undefined if not in the pipeline
   */
  index?: number;
}

/**
 * Represents a pipeline test
 */
export interface PipelineTest {
  /**
   * The test entity ID
   */
  id?: number;

  /**
   * The creation datetime
   */
  createdOn?: Date;

  /**
   * The user defined test name
   */
  name?: string;

  /**
   * The test input
   */
  input?: string;

  /**
   * The expected test output
   */
  output?: string;
}

export interface Message {
  code: string;
  parameters?: { [key: string]: any };
}

export interface CompilationError {
  row: number;
  column: number;
  message: Message | string;
}

export interface TestResult {
  testId: number;
  passed: boolean;
  message: Message | string;
}
