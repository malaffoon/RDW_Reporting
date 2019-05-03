/**
 * Declares the different lifecycle stages of a pipeline script
 */
export type PipelineState =
  | 'Compiling'
  | 'Testing'
  | 'Validating'
  | 'Publishing'
  | 'Failed';

export type CompilationState = 'Compiling' | 'Failed';
