;; FUNCTIONS FOR What-is-the-genetic-code TOUR
;   These functions are available to students but the code is not

(LISP:IN-PACKAGE :CL-USER)
(bbi::DEFPACKAGE :Alien-world (:use :BBL))
(bbi::IN-PACKAGE :Alien-world)

; (LET ((wb::*guru-allow-arbitrary-redefinitions* T))
 
(SETF wb::*guru-allow-arbitrary-redefinitions* T)
(DEFINE-FUNCTION Make-Random-RNA 
  SUMMARY "Returns a sequence determined by the input string or list"
  REQUIRED string-or-list
  #|
 "(MAKE-RANDOM-RNA string-or-list)
   - Returns a sequence determined by the input string or list
   - If a string is given, then that string is iterated until the 
         result sequence is at least 1000 nucleotides
   - If a list is given, then elements of the list are chosen at
         random until a sequence grows to at least 1000 nucleotides
   - EXAMPLES:
       (MAKE-RANDOM-RNA \"U\") ==> \"UUUUUUUUUU...\"
       (MAKE-RANDOM-RNA \"UC\") ==> \"UCUCUCUCUC...\"
       (MAKE-RANDOM-RNA (LIST \"A\" \"A\" \"A\" \"C\"))
           ==> \"CAAAAAAAAAAAAAACAAAAAAAACAACAAAAACAAA...\"
  "
|#
  BODY
   (LET* ((choices (BBI::ENSURE-LIST string-or-list))
          (length 0))
       
     (bbi::LOOP WHILE (< length 1000)
           AS fragment = (CHOOSE-FROM choices)
           DO (INCF length (LENGTH fragment))
           COLLECT fragment INTO RNA-list
           FINALLY (RETURN (JOIN RNA-list)))))


(DEFUN In-vitro-translate-sample (sequence &KEY earthly)
  "Takes RNA sequence and translates it, according to alien rules"
  (LET* ((ET-sequence 
            (IF earthly
                sequence
                (TRANSLITERATE sequence "ACGUacgu" "GAUCGAUC")))
         (iterations 0)
         (max-iterations 100))
      
     (LOOP UNTIL (> iterations max-iterations)
           AS start = (1+ (bbi::RANDOM (- (LENGTH sequence) 1)))
           AS aa-seq-raw 
               = (TRANSLATION-OF (SEQUENCE-OF ET-SEQUENCE FROM start)
                      IF-BAD-CODON :ignore)
           AS first-stop = (bbi::POSITION #\* aa-seq-raw)
           AS aa-seq 
               = (IF first-stop
                     (bbi::SUBSEQ aa-seq-raw 0 first-stop)
                     aa-seq-raw)
           DO (INCF iterations)
           WHEN (> (LENGTH aa-seq) 0)
              COLLECT  aa-seq)))

(DEFUN In-vitro-translate-aux (sequence &KEY sample)
  "Gives reproducible different genetic code to each user"
  (LET* ((codons (ALL-COMBINATIONS-OF "ACGU" OF-LENGTH 3))
         (initial-lookup-string1
             "EWIRVLQIINL*SDLDAASPAGHLAFKGCTTRTRRYLGYSLFSVVPQ*SMVCTGN*EHSRPKPR")
         (initial-lookup-string2 (REVERSE initial-lookup-string1))
         (aa-table initial-lookup-string1)
         (max-code 128)
         (user-code 
           (IF sample
               0
              (MOD 
                (FOR-EACH letter in (STRING-OF *username*)
                  ;  AS code = (LISP::CHAR-CODE (lisp::CHAR letter 0))
                     AS code = (LISP::CHAR-CODE letter)
                     SUM code)
                max-code)))
         (iterations 0)
         (max-iterations 100)
         )
 
     (WHEN (> user-code 63)
           (SETF aa-table initial-lookup-string2)
           (SETF user-code (- user-code 64)))
     (SETF aa-table
         (JOIN (SUBSEQ aa-table user-code)
               (SUBSEQ aa-table 0 user-code)))
     (IF sample
         (SETF sequence (TRANSLITERATE sequence "ACGU" "GAUC")))

     (LOOP UNTIL (> iterations max-iterations)
           AS start = (1+ (bbi::RANDOM (- (LENGTH sequence) 1)))
           AS aa-seq 
               = (FOR-EACH codon IN (SPLIT (SUBSTRING sequence FROM start) EVERY 3)
                      INITIALIZE peptide = ""
                      AS codon-number = (bbi::POSITION codon codons :TEST 'EQUAL)
                      AS aa = (IF codon-number
                                 (SUBSEQ aa-table codon-number (1+ codon-number)))
                      (IF (OR (EQUAL aa "*") (NOT codon-number))
                          (RETURN peptide)
                          (SETF peptide (JOIN peptide aa)))
                      FINALLY (RETURN peptide))
           DO (INCF iterations)
           WHEN (> (LENGTH aa-seq) 0)
              COLLECT  aa-seq)
))
	
(DEFINE-FUNCTION In-vitro-translate 
  SUMMARY "Takes RNA sequence and translates it, according to alien rules"
  REQUIRED sequence
#|
  "(IN-VITRO-TRANSLATE sequence)
    - Takes RNA sequence and translates it, according to alien rules
    - Translation may initiate anywhere within the given sequence
    - Returns a list of peptides resulting from 100 translations
    - RNA may be conveniently generated by means of MAKE-RANDOM-RNA
    - EXAMPLE:
        (IN-VITRO-TRANSLATE (MAKE-RANDOM-RNA \"UC\"))
  "
  |# 
  FLAG sample-1
  FLAG sample-2
  FLAG earthly-code
  INITIALIZE uc-sequence = (STRING-UPCASE sequence)
  INITIALIZE bad-nuc 
      = (lisp::FIND-IF-NOT 
            (LAMBDA (x) 
                (MEMBER x '(#\A #\C #\G #\U)))
            uc-sequence)
  BODY
   (IF (< (LENGTH sequence) 20)
       (ERROR "Length of sequence (~A nt) is too small to bind ribosomes" 
              (LENGTH sequence)))
   (IF bad-nuc
       (ERROR (bbi::S+ "The nucleotide '~A' does not belong in RNA! "
                  "(There may be other problems as well)")
              (STRING-OF bad-nuc)))
   (IF (OR sample-1 earthly-code)
       (IN-VITRO-TRANSLATE-sample sequence :EARTHLY earthly-code)
       (IN-VITRO-TRANSLATE-aux sequence :SAMPLE sample-2))
) 


(DEFINE-FUNCTION Analyze-amino-acid-content 
  SUMMARY "Counts amino acids found within the list of peptides"
  REQUIRED peptide-list
  #|
 "(ANALYZE-AMINO-ACID-CONTENT peptide-list)
  - Counts amino acids found within the list of peptides
  - The peptides may be generated using IN-VITRO-TRANSLATE
  - EXAMPLE:
      (ANALYZE-AMINO-ACID-CONTENT (IN-VITRO-TRANSLATE (MAKE-RANDOM-RNA \"UC\")))
 "  
  |#
  BODY
  (LET ((aa-count (bbi::MAKE-HASH-TABLE :TEST 'EQUAL))) 
    (LOOP FOR peptide IN peptide-list
          DO (LOOP FOR aa IN peptide
                   AS old-value = (bbi::GETHASH aa aa-count)
                   DO (IF old-value 
                          (INCF (bbi::GETHASH aa aa-count))
                          (SETF (bbi::GETHASH aa aa-count) 1))))
                   
    (bbi::LOOP FOR aa BEING THE HASH-KEYS IN aa-count
          DO (DISPLAY-LINE (biolisp::AA-TO-3-LETTER-CODE aa) *tab*
                           (bbi::GETHASH aa aa-count))
          COLLECT (LIST aa (bbi::GETHASH aa aa-count)))
))


(DEFINE-FUNCTION Analyze-peptide-content 
  SUMMARY "Counts peptides found within the list of peptides"
  REQUIRED peptide-list
  #|
 "(ANALYZE-PEPTIDE-CONTENT peptide-list)
  - Counts peptides found within the list of peptides
  - The peptides may be generated using IN-VITRO-TRANSLATE
  - Only the first 12 amino acids of each peptide are considered
  - EXAMPLE:
      (ANALYZE-PEPTIDE-CONTENT (IN-VITRO-TRANSLATE (MAKE-RANDOM-RNA \"U\")))
 "  
   |#
  BODY
  (LET ((peptide-count (NEW-TABLE (LIST $) ))) 
    (LOOP FOR peptide IN peptide-list
          AS peptide-part 
            = (IF (> (LENGTH peptide) 12)
                  (JOIN (LIST (FIRST 12 IN peptide) "..."))
                  peptide)
          DO (LET ((value (OR (REF peptide-count peptide-part) 0)))
               (SETF (REF peptide-count peptide-part) (INCF value))))
    (LOOP FOR peptide IN (LABELS-OF peptide-count DIMENSION 1)
          DO (DISPLAY-LINE peptide *tab*
                           (REF peptide-count peptide))
          COLLECT (LIST peptide (REF peptide-count peptide)))
))
 
(SETF wb::*guru-allow-arbitrary-redefinitions* NIL)
                   
(lisp:eval-when (:compile-toplevel :load-toplevel :execute)
  (bbi::EXPORT 
   '(Make-random-RNA
     In-vitro-translate 
     Analyze-peptide-content 
     Analyze-amino-acid-content))
  )