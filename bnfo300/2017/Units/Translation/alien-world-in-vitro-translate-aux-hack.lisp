(DEFUN In-vitro-translate-aux-hack (sequence &KEY sample (user *username*)
  "Gives reproducible different genetic code to each user"
  (LET* ((codons (ALL-STRINGS OF-LENGTH 3 USING "ACGU"))
         (initial-lookup-string1
             "EWIRVLQIINL*SDLDAASPAGHLAFKGCTTRTRRYLGYSLFSVVPQ*SMVCTGN*EHSRPKPR")
         (initial-lookup-string2 (REVERSE initial-lookup-string1))
         (aa-table initial-lookup-string1)
         (max-code 128)
         (user-code 
           (IF sample
               0
              (MOD 
                (FOR-EACH letter in (STRING-OF user)
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