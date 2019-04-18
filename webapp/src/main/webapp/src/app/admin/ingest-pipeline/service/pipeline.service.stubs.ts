import { Pipeline, PipelineScript } from '../model/pipeline';

export const stubIngestPipelines: Pipeline[] = <Pipeline[]>[
  {
    id: 'assessment',
    inputType: 'xml'
  },
  {
    id: 'exam',
    inputType: 'xml'
  },
  {
    id: 'group',
    inputType: 'csv'
  }
];

export const stubPipelineScript: PipelineScript = {
  id: 1,
  language: 'groovy',
  body: `// XML support can be added to a Script class by calling:
// \`script.addXmlExtensions()\`. We assume that an XML document
// will be converted into another XML document, and all elements, including
// comments not specifically altered, should appear in the converted
// document exactly as they appear in the original. 
//
// This will automatically parse the input into a JDOM 2 Document, 
// which is made available to the scripts in the inherent variable \`document\`.
// However, it will also enable some helper functions that act implicitly
// on the document, and may ease writing XML transformation scripts and
// make it unnecessary for the script writer to ever reference the
// document object explicitly. 
//
// Some examples follow:
// transform '//Movie' by { movie -> 
//     if (movie.title == 'Jaws') {
//         movie.title = movie.title.toUpperCase()
//     }
// }
//
// Here \`//Movie\` is an XPath expression that returns all Movie elements
// in the document. The code within the braces will be applied to each
// matched elements, and follows general Groovy syntax rules. The \`movie ->\`
// syntax just
// assigns a name for the element that the code within the braces can use.
// It can be any string that makes sense for the script, or it can also be omitted. In this case,
// the element is automatically assigned the name \`it\`. 
//
// For example, this script works exactly the same as the first one:
//
// transform '//Movie' by {  
//     if (it.title == 'Jaws') {
//         it.title = it.title.toUpperCase()
//     }
// }
//
// The syntax \`movie.title\` (or \`it.title\`) refers to the title
// attribute of the movie element. It is shorthand for \`movie.getAttributeValue('title')\`,
// and \`movie.title = 'some text'\` is shorthand for \`movie.setAttribute('title', 'some text')\`.
// An exception to this rule is \`movie.text\`, which is shorthand for
// \`movie.getText()\`, and returns the text content of the movie element
// instead of an attribute value.
//
// For the transformation rule, any legal Groovy (or Java) syntax is allowed.
// This includes if-then-else blocks, regular expressions, calls to external
// services, etc.
//
// It is also possible to delete an element in a transformation rule. 
// For example:
//
// transform '//Movie' by { movie -> 
//     if (movie.actor == 'Keanu Reeves') {
//         delete movie
//     }
// }
//
// #### Filter
// Although deleting elements as part of a transform rule is possible, 
// it is also possible to filter elements based on an in-or-out rule:
//
// delete '//Movie' when { movie -> 
//     movie.actor == 'Keanu Reeves'
// }
//
// It is also possible to reverse this logic to delete all elements
// (matching the XPath expression) that don't match the rule:
//
// delete '//Movie' unless { movie -> 
//     movie.actor == 'Richard Basehart'
// }
//
// #### XSL transformations
// Although the script pipeline is meant to replace XSL transformations,
// it might happen that performing some work in XSL is preferable to 
// writing Groovy rules. Therefore, a helper function for XSL has been provided:
//
// applyXsl xsl
//
// The \`xsl\` variable here is defined in the configuration for the script,
// and can be a string containing XSL rules, a file represented as a
// \`java.io.File\` object, or a \`java.io.InputStream\` object.
//
// It is also possible to combine XSL transformations with additional
// Groovy rules:
//
// applyXsl preprocessing
//
// transform '//Movie' {movie ->
//     if (movie.rating > 2) {
//         movie.recommend = true
//     } else {
//         movie.recommend = false
//     }
// }
//
// applyXsl postprocessing
//
// #### Getting the results
// Once all transformations have been applied to the XML document, it is
// necessary to convert it back to a string and return it. The helper 
// function outputXml does this, and should be the last statement
// in the script:
//
// transform '//Movie' by {  
//     if (it.title == 'Jaws') {
//         it.title = it.title.toUpperCase()
//     }
// }

transform '//Item' by { item ->
    if (item.bankKey.startsWith('10')) {
        item.bankKey = item.bankKey.substring(2)
    }
}

transform '//Response' by { response ->
    def text = response.text

    if (text.contains('choiceInteraction_1') && text.contains('choiceInteraction_2')) {
        response.text = text
                .replaceAll(~/choiceInteraction_(\\d).RESPONSE/, 'EBSR$1')
                .replaceAll(~/choiceInteraction_\\d-choice-(\\w)/, '$1')

    } else if (text.contains('choiceInteraction_1')) {
        def matches = text =~ /choiceInteraction_1-choice-(\\w)/
        if (matches.count > 0) {
            response.text = matches.collect { it[1] }.join(',')
        }

    } else if (text.contains('matchInteraction')) {
        response.text = text
                .replaceAll(~/matchInteraction_\\d.RESPONSE/, 'RESPONSE')
                .replaceAll(~/matchInteraction_\\d-(\\d)\\W*matchInteraction_\\d-(\\w)/, '$1 $2')

    } else if (text.contains('hotTextInteraction_')) {
        response.text = text
                .replaceAll(~/hotTextInteraction_(\\d).RESPONSE/, '$1')
                .replaceAll(~/hotTextInteraction_\\d-hottext-(\\d)/, '$1')

    } else if ( text.contains('equationInteraction_') ||
                text.contains('tableInteraction_') ||
                text.contains('gridInteraction_') ||
                text.contains('textEntryInteraction_')) {
        response.text = text
                .replaceAll(~/(?s).+<value>(.+)<\\/value>.+/, '$1')
                .unescapeHtmlTags()
    }
}

outputXml
`
};
